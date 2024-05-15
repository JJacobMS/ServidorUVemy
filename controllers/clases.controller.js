const { clases, cursos } = require('../models');
let self = {}

self.obtenerPorId = async function(req, res){
    if(req.params.id == null) return res.status(400).json({ message : "No especificó el ID"})
    try{
        let data = await clases.findOne({ where: {idClase: req.params.id}, attributes: ['idClase', 'nombre', 'descripcion', 'idCurso']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

self.obtenerPorCurso = async function(req, res){
    if(req.params.idCurso == null) return res.status(400).json({ message : "No especificó el curso"})
    try{
        let data = await clases.findAll({ where: {idCurso: req.params.idCurso}, attributes: ['idClase', 'nombre', 'descripcion', 'idCurso']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

self.create = async function(req, res){
    try{
        if(req.body.idCurso == null) return res.status(400).send();

        let curso = await cursos.findOne({ where: { idCurso: req.body.idCurso }});

        if(curso == null) return res.status(400).send();

        if(req.body.nombre == null || req.body.descripcion == null) return res.status(400).send();

        const data = await clases.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            idCurso: req.body.idCurso
        });

        return res.status(201).json(data);
    }catch(error){
        return res.status(500).json(error);
    }
}

module.exports = self;


