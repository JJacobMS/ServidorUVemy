const { sequelize, DataTypes } = require('sequelize');
const cursoEtiqueta = require('../models/cursosusuarios');
const db = require('../models/index');
const cursosusuarios = db.cursosusuarios;
const cursos = db.cursos;
let self = {}

self.getAll = async function (req, res){
    try{
        let data = await cursosusuarios.findAll({ attributes: ['idCursoEtiqueta', 'idCurso', 'idEtiqueta']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        let id = req.params.id;
        let data = await cursosusuarios.findByPk(id, { attributes: ['idCursoEtiqueta', 'idCurso', 'idEtiqueta']});
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
        let cursoCreado = await cursosusuarios.create({
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
        let data = await cursosusuarios.update(body, {where:{idCursoEtiqueta:id}});
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
        let data = await cursosusuarios.findByPk(id);
        if(!data){
            return res.status(404).send()
        }

        if(data.protegida){
            return res.status(400).send()
        }

        data = await cursosusuarios.destroy({ where : {idCursoEtiqueta:id}});
        if(data === 1){
            return res.status(204).send()
        }else{
            return res.status(404).send()
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

self.deleteEtiquetasDelCurso = async function(cursoId){
    try{
        let id = cursoId;
        let data = await cursos.findByPk(id);
        if(!data){
            return 404
        }

        if(data.protegida){
            return 400
        }
        data = await cursosusuarios.destroy({ where : {idCurso:id}});
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