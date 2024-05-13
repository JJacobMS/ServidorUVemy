const { clases, cursos } = require('../models');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await clases.findAll({ attributes: ['idClase', 'nombre', 'descripcion', 'idCurso']})
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

        return res.status(201).send();
    }catch(error){
        return res.status(500).json(error);
    }
}

module.exports = self;


