const { sequelize, DataTypes } = require('sequelize');
const cursoEtiqueta = require('../models/cursosetiquetas');
const db = require('../models/index');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const cursosetiquetas = db.cursosetiquetas;
const cursos = db.cursos;
const etiquetas = db.etiquetas;
const usuarios = db.usuarios;
let self = {}

self.getAll = async function (req, res){
    try{
        let data = await cursosetiquetas.findAll({ attributes: ['idCursoEtiqueta', 'idCurso', 'idEtiqueta']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        let data = await cursosetiquetas.findByPk(id, { attributes: ['idCursoEtiqueta', 'idCurso', 'idEtiqueta']});
        if(data){
            return res.status(200).json(data)
        }else{
           return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.create = async function(req, res){
    try{
        let cursoCreado = await cursosetiquetas.create({
            idCurso: req.body.idCurso,
            idEtiqueta: req.body.idEtiqueta,
        })
        return res.status(201).json(cursoCreado)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.update = async function(req, res){
    try{
        let id = req.params.id;
        let body = req.body;
        let data = await cursosetiquetas.update(body, {where:{idCursoEtiqueta:id}});
        if(data[0]==0){
            return res.status(404).send()
        }else{
            return res.status(204).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.delete = async function(req, res){
    try{
        let id = req.params.id;
        let data = await cursosetiquetas.findByPk(id);
        if(!data){
            return res.status(404).send()
        }
        data = await cursosetiquetas.destroy({ where : {idCursoEtiqueta:id}});
        if(data === 1){
            return res.status(204).send()
        }else{
            return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.borrarEtiquetasDelCurso = async function(cursoId){
    try{
        let id = cursoId;
        let data = await cursos.findByPk(id);
        if(!data){
            return 404
        }
        data = await cursosetiquetas.destroy({ where : {idCurso:id}});
        if(data >= 1 ){
            return 204
        }else{
            return 404
        }
    }catch(error){
        return { status: 500, message: error.message };
    }
}

self.crearCursosEtiquetas = async function(idCurso, idEtiqueta){
    try{
        let cursoRecuperado = await cursos.findByPk(idCurso);
        if(cursoRecuperado==null){
            return { status: CodigosRespuesta.NOT_FOUND, message: "No se encontró el curso" } 
        }
        let etiquetaRecuperada = await etiquetas.findByPk(idEtiqueta);
        if(etiquetaRecuperada==null){
            return { status: CodigosRespuesta.NOT_FOUND, message: "No se encontró la etiqueta curso" }
        }
        let etiquetaCreada = await cursosetiquetas.create({
            idCurso: idCurso,
            idEtiqueta: idEtiqueta,
            idClase: 1
        })
        if(etiquetaCreada==null){
            return { status: CodigosRespuesta.INTERNAL_SERVER_ERROR, message: "Error al crear la etiqueta curso" };;
        }
        return { status: CodigosRespuesta.CREATED, message:etiquetaCreada }
    }catch(error){
        return { status: CodigosRespuesta.INTERNAL_SERVER_ERROR, message:error.message  }
    }
}

module.exports = self;