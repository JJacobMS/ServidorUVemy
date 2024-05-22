const { sequelize, DataTypes } = require('sequelize');
const usuariosCursos = require('../models/usuarioscursos');
const db = require('../models/index');
const usuarioscursos = db.usuarioscursos;
const cursos = db.cursos;
let self = {}

self.getAll = async function (req, res){
    try{
        let data = await usuarioscursos.findAll({ attributes: ['idUsuarioCurso', 'calificacion', 'idCurso', 'idUsuario']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        let data = await usuarioscursos.findByPk(id, { attributes: ['idUsuarioCurso', 'calificacion', 'idCurso', 'idUsuario']});
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
        let cursoCreado = await usuarioscursos.create({
            idCurso: req.body.idCurso,
            idEtiqueta: req.body.idEtiqueta,
            idUsuarioCurso, calificacion, idCurso, idUsuario
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
        let data = await usuarioscursos.update(body, {where:{idCursoEtiqueta:id}});
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
        let data = await usuarioscursos.findByPk(id);
        if(!data){
            return res.status(404).send()
        }
        data = await usuarioscursos.destroy({ where : {idCursoEtiqueta:id}});
        if(data === 1){
            return res.status(204).send()
        }else{
            return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.borrarUsuariosInscritosDelCurso = async function(cursoId){
    try{
        let id = cursoId;
        let data = await cursos.findByPk(id);
        if(!data){
            return 404
        }
        data = await usuarioscursos.destroy({ where : {idCurso:id}});
        if(data >= 1 ){
            return 204
        }else{
            return 404
        }
    }catch(error){
        return { status: 500, message: error.message };
    }
}

module.exports = self;