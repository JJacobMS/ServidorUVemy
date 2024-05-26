const { documentos, tiposarchivos, clases, cursos } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const jwtSecret = process.env.JWT_SECRET;
const claimTypes = require('../config/claimtypes');
const jwt = require('jsonwebtoken');
const { TAMANIO_MAXIMO_VIDEOS_KB } = require('../utils/tamanioDocumentos');
const { where } = require('sequelize');

async function enviarVideoClase (call, callback) {
    const stream = [];
    let datosDocumento;

    try{
        call.on('data', (message) =>{
            if(message.datosVideo != null){
                datosDocumento = message.datosVideo;
            }
            if(message.chunks != null){
                stream.push(message.chunks);
                console.log(".");
            }
        })

        call.on('end', async ()=>{
            try{

                console.log("fin recepción nueva");
                if(stream == null || datosDocumento.nombre == null || datosDocumento.idClase == null || datosDocumento.jwt == null){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST});
                    return;
                }

                const esValido = autenticarToken(datosDocumento.jwt, datosDocumento.idClase, 0);
                if(!esValido){
                    console.log("no");
                    callback(null, {respuesta: CodigosRespuesta.FORBIDDEN})
                    return;
                }

                const video = Buffer.concat(stream);
                const tamanioKB = video.length/1024;
                if(tamanioKB > TAMANIO_MAXIMO_VIDEOS_KB){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                        return;
                }
            
                const idTipoArchivo = await verificarIdTipoArchivoVideo();
                if(idTipoArchivo == 0){
                    callback(null, {respuesta: CodigosRespuesta.INTERNAL_SERVER_ERROR})
                    return;
                }

                const existeClase = await verificarExistenciaClase(datosDocumento.idClase);
                if(existeClase == false){ 
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                    return;
                }

                const sinVideo = await verificarClaseSinVideo(datosDocumento.idClase, idTipoArchivo);
                if(sinVideo == false){ 
                    console.log("Con video");
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                    return;
                }

                const documento = await documentos.create({
                    archivo: video,
                    nombre: datosDocumento.nombre,
                    idTipoArchivo: idTipoArchivo,
                    idClase: datosDocumento.idClase
                });
            }catch(error){
                callback(null, {respuesta: CodigosRespuesta.INTERNAL_SERVER_ERROR});
            }

            const respuesta = { respuesta : CodigosRespuesta.OK};
            callback(null, respuesta);
        })

    }catch(error){
        console.log("Error grpc");
        console.log(error);
    }
}  

async function actualizarVideoClase (call, callback) {
    const stream = [];
    let datosDocumento;

    try{
        call.on('data', (message) =>{
            if(message.datosVideo != null){
                console.log(message.datosVideo);
                datosDocumento = message.datosVideo;
            }
            if(message.chunks != null){
                stream.push(message.chunks);
                console.log(".");
            }
        })

        call.on('end', async ()=>{
            console.log("fin receppción modificar");

            try{
                if(stream == null || datosDocumento.nombre == null || datosDocumento.jwt == null || datosDocumento.idVideo == null){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST});
                    return;
                }

                const esValido = autenticarToken(datosDocumento.jwt, 0, datosDocumento.idVideo);
                if(!esValido){
                    callback(null, {respuesta: CodigosRespuesta.FORBIDDEN})
                    return;
                }

                const video = Buffer.concat(stream);
                const tamanioKB = video.length/1024;
                if(tamanioKB > TAMANIO_MAXIMO_VIDEOS_KB){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                        return;
                }

                const doc = await documentos.findByPk(datosDocumento.idVideo, 
                    { attributes: ['idDocumento', 'archivo', 'nombre', 'idTipoArchivo', 'idCurso', 'idClase']});

                if(doc == null){ 
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                    return;
                }

                doc.archivo = video;

                await doc.save();

            }catch(error){
                console.log(error)
                callback(null, {respuesta: CodigosRespuesta.INTERNAL_SERVER_ERROR});
            }

            const respuesta = { respuesta : CodigosRespuesta.OK};
            callback(null, respuesta);
        })

    }catch(error){
        console.log("Error grpc");
        console.log(error);
    }
}  

function autenticarToken(tokenPeticion, idClase, idDocumento){
    let esValido = false;
    if (!tokenPeticion.startsWith('Bearer ')){
        esValido = false;
    }else{
        try{
            const token = tokenPeticion.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);
            if(idClase > 0){
                if(verificarEsProfesorIdClase(tokenDecodificado[claimTypes.id], idClase)){
                    esValido = true;
                }
            }
            if(idDocumento > 0){
                if(verificarEsProfesorIdDocumento(tokenDecodificado[claimTypes.id], idDocumento)){
                    esValido = true;
                }
            }
        
        }catch(error){
            console.log(error);
            esValido = false;
        }
    }

    return esValido;
}

async function verificarEsProfesorIdClase(idUsuario, idClase){
    const cursoDelProfesor = await cursos.findOne({ attributes: ['idCurso', 'idUsuario'], 
        include: { model: clases, as: "clases", attributes: ['idClase'], where: { idClase : idClase}}
    });

    if(cursoDelProfesor == null){
        return false;
    }

    if(cursoDelProfesor.idUsuario == idUsuario){
        return true;
    }
    
    return false;
}

async function verificarEsProfesorIdDocumento(idUsuario, idDocumento){
    const cursoDelProfesor = await cursos.findOne({ attributes: ['idCurso', 'idUsuario'],
        include: { model: clases, as: "clases", attributes: [], 
        include: { model: documentos, as: "documentos", where: {idDocumento: idDocumento}, attributes: []}}, 
    });

    if(cursoDelProfesor == null){
        return false;
    }

    if(cursoDelProfesor.idUsuario == idUsuario){
        return true;
    }
    
    return false;
}

async function verificarIdTipoArchivoVideo(){
    let idTipoArchivo;
    try{
        const tipoArchivoVideo = await tiposarchivos.findOne({ where: {nombre: "video/mp4"}, attributes: ['idTipoArchivo']});
        if(tipoArchivoVideo == null){
            const tipoNuevo = await tiposarchivos.create({
                nombre: "video/mp4"
            });
            if(tipoNuevo == null){
                idTipoArchivo = 0;
            }else{
                idTipoArchivo = tipoNuevo.idTipoArchivo;
            }
        }else{
            idTipoArchivo = tipoArchivoVideo.dataValues.idTipoArchivo;
        }
    }catch(error){
        console.log(error);
        idTipoArchivo = 0;
    }
    return idTipoArchivo;
}

async function verificarExistenciaClase(idClase){
    let existe;
    try{
        const clase = await clases.findByPk(idClase);
        existe = (clase != null);

    }catch(error){
        console.log(error);
        existe = false;
    }
    return existe;
}

async function verificarClaseSinVideo(idClase, idTipoArchivo){
    let sinVideo;
    try{
        const documentoExistente = await documentos.findOne({where: { idClase: idClase, idTipoArchivo: idTipoArchivo}, attributes: ['idDocumento']});
        sinVideo = (documentoExistente == null);

    }catch(error){
        console.log(error);
        sinVideo = true;
    }
    return sinVideo;
}

async function recibirVideoClase(call) {
    const idVideo = call.request.idVideo;

    try {
        const video = await documentos.findOne({ where: { idDocumento: idVideo }, attributes: ['archivo'] });

        if (!video) {
            console.error('No se encontro el video', idVideo);
            call.end();
            return;
        }

        const videoData = video.archivo;
        const chunkSize = 18 * 1024;
        let offset = 0;

        while (offset < videoData.length) {
            const chunk = videoData.slice(offset, offset + chunkSize);
            call.write({ chunks: chunk });
            offset += chunkSize;
        }

        call.end();
    } catch (error) {
        console.error('Error al enviar el video', idVideo, error);
        call.end();
    }
}

module.exports = { enviarVideoClase, recibirVideoClase, actualizarVideoClase };