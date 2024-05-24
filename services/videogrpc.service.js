const { documentos, tiposarchivos, clases } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { TAMANIO_MAXIMO_VIDEOS_KB } = require('../utils/tamanioDocumentos');

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

                if(stream == null || datosDocumento.nombre == null || datosDocumento.idClase == null || datosDocumento.jwt == null){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST});
                    return;
                }

                /*const esValido = autenticarToken(datosDocumento.jwt);
                if(!esValido){
                    callback(null, {respuesta: CodigosRespuesta.FORBIDDEN})
                    return;
                }*/

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
            try{
                if(stream == null || datosDocumento.nombre == null || datosDocumento.jwt == null || datosDocumento.idVideo == null){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST});
                    return;
                }

                /*const esValido = autenticarToken(datosDocumento.jwt);
                if(!esValido){
                    callback(null, {respuesta: CodigosRespuesta.FORBIDDEN})
                    return;
                }*/

                const video = Buffer.concat(stream);
                const tamanioKB = video.length/1024;
                if(tamanioKB > TAMANIO_MAXIMO_VIDEOS_KB){
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                        return;
                }

                const doc = await documentos.findByPk(datosDocumento.idVideo, 
                    { attributes: ['idDocumento', 'archivo', 'nombre', 'idTipoArchivo', 'idCurso', 'idClase']});

                console.log(datosDocumento.id);
                console.log(doc);
                if(doc == null){ 
                    callback(null, {respuesta: CodigosRespuesta.BAD_REQUEST})
                    return;
                }

                doc.nombre = datosDocumento.nombre;
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

function autenticarToken(tokenPeticion){
    let esValido;
    if (!tokenPeticion.startsWith('Bearer ')){
        esValido = false;
    }else{
        try{
            const token = tokenPeticion.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);
            esValido = true;
        }catch(error){
            console.log(error);
            esValido = false;
        }
    }

    return esValido;
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

async function recibirVideoClase(call, callback) {
    let datosSolicitud;

    call.on('data', (message) => {
        datosSolicitud = message;
    });

    call.on('end', async () => {
        if (!datosSolicitud || !datosSolicitud.idClase || !datosSolicitud.jwt) {
            call.end();
            callback(null, { respuesta: CodigosRespuesta.BAD_REQUEST });
            return;
        }

        const esValido = autenticarToken(datosSolicitud.jwt);
        if (!esValido) {
            call.end();
            callback(null, { respuesta: CodigosRespuesta.UNAUTHORIZED });
            return;
        }

        try {
            const video = await obtenerVideoClase(datosSolicitud.idClase);
            if(!video){
                call.end();
                callback(null, { respuesta: CodigosRespuesta.NOT_FOUND });
                return;
            }

            const tamanioChunks = 18 * 1024;
            for (let i = 0; i < video.length; i += tamanioChunks) {
                const chunk = video.slice(i, i + tamanioChunks);
                call.write({ chunks: chunk });
            }

            call.end();
        } catch (error) {
            console.log(error);
            call.end();
            callback(null, { respuesta: CodigosRespuesta.INTERNAL_SERVER_ERROR });
        }
    });
}

async function obtenerVideoClase(idClase){
    try {
        const video = await documentos.findOne({ where: { idClase: idClase }, attributes: ['archivo'] });
        return video ? video.archivo : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { enviarVideoClase, recibirVideoClase, actualizarVideoClase };