const db = require('../models/index');
const dbdocumentos = db.documentos;
const cursos = db.cursos;
const { documentos, tiposarchivos } = require('../models');
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

self.crearArchivoDelCurso = async function(documento, idCurso){
    try{
        console.log(documento);
        console.log(idCurso);
        let documentoCreado  = await dbdocumentos.create({
            archivo: documento,
            nombre: null, 
            idTipoArchivo: 1, //Debo de comprobar el mymetipe
            idCurso: idCurso,
            idClase: 8
        })
        console.log(documentoCreado);
        return { status: 201, message: documentoCreado };;
    }catch(error){
        console.log("error");
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
        console.log(error);
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
        console.log(error);
        idTipoArchivo = 0;
    }
    return idTipoArchivo;
}

module.exports = self;
