const { documentos } = require('../models');
const db = require('../models/index');
const dbdocumentos = db.documentos;
const cursos = db.cursos;
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await dbdocumentos.findAll({ attributes: ['idDocumento', 'archivo', 'nombre', 'idTipoArchivo', 'idCurso', 'idClase']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

self.create = async function(req, res){
    try{
        let documentoCreado  = await dbdocumentos.create({
            archivo: req.body.archivo,
            nombre: req.body.nombre,
            idTipoArchivo: req.body.idTipoArchivo,
            idCurso: req.body.idCurso,
            idClase: req.body.idClase
        })
        return res.status(201).json(documentoCreado)
    }catch(error){
        return res.status(500).json({ error: error.message });
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

module.exports = self;
