const db = require('../models/index');
const dbdocumentos = db.documentos;
const cursos = db.cursos;
const { documentos, tiposarchivos } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await dbdocumentos.findAll({ attributes: ['idDocumento', 'archivo', 'nombre', 'idTipoArchivo', 'idCurso', 'idClase']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

self.borrarArchivoDelCurso = async function(documentoId){
    try{
        let id = documentoId;
        let data = await cursos.findByPk(id);
        if(!data){
            return 404
        }
        data = await dbdocumentos.destroy({ where : {idDocumento:id}});
        if(data >= 1 ){
            return 204
        }else{
            return 404
        }
    }catch(error){
        return { status: 500, message: error.message };
    }
}

self.crearArchivoDelCurso = async function(documento, idCurso, transaccion){
    try{
        let documentoCreado  = await dbdocumentos.create({
            archivo: documento,
            nombre: "Miniatura del curso "+idCurso,
            idTipoArchivo: 1, //Debo de comprobar el mymetipe
            idCurso: idCurso,
            idClase: null
        }, { transaction: transaccion })
        if(documentoCreado==null){
            return { status: CodigosRespuesta.INTERNAL_SERVER_ERROR, message: "Error al crear el documento" };
        }
        return { status: 201, message: documentoCreado };;
    }catch(error){
        return { status: 500, message: error.message };
    }
}

self.crear = async function(req, res){
    try{
        const idTipoArch = await obtenerIdTipoArchivoPDF();
        if(idTipoArch == 0) return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error al crear el documento");

        const archivoBuffer = req.file.buffer;

        const data = await documentos.create({
            archivo: archivoBuffer,
            nombre: req.body.nombre,
            idClase: req.body.idClase,
            idTipoArchivo: idTipoArch
        });

        if(data == null) return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error al crear el documento " + req.body.nombre);

        const respuesta = {
            idDocumento: data.idDocumento,
            nombre: data.nombre,
            idClase: data.idClase,
            idTipoArchivo: data.idTipoArchivo
        }

        return res.status(201).json(respuesta);
    }catch(error){
        return res.status(500).json(error)
    }
}

async function obtenerIdTipoArchivoPDF(){
    let idTipoArchivo;
    try{
        const tipoArchivoVideo = await tiposarchivos.findOne({ where: {nombre: "application/pdf"}, attributes: ['idTipoArchivo']});
        if(tipoArchivoVideo == null){
            const tipoNuevo = await tiposarchivos.create({
                nombre: "application/pdf"
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
        idTipoArchivo = 0;
    }
    return idTipoArchivo;
}

self.actualizarArchivoDelCurso = async function(idDocumento, documento, transaccion){
    try{
        let data = await dbdocumentos.update(
            { archivo: documento }, 
            {where:{idDocumento:idDocumento}, 
            fields: ['archivo'],
            transaction: transaccion
        });
        
        if(data[0]==0){
            console.log("NOT_FOUND");
            return CodigosRespuesta.NOT_FOUND
        }else{
            console.log("NO_CONTENT");
            return CodigosRespuesta.NO_CONTENT
        }
    }catch(error){
        return { status: CodigosRespuesta.INTERNAL_SERVER_ERROR, message:error.message  }
    }
}

module.exports = self;
