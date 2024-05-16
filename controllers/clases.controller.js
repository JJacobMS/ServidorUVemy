const { clases, cursos, documentos, tiposarchivos } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
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

self.crear = async function(req, res){
    try{
        let curso = await cursos.findOne({ where: { idCurso: req.body.idCurso }});

        if(curso == null) return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el curso");
        
        const data = await clases.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            idCurso: req.body.idCurso
        });

        if(data == null) return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error al crear la clase");

        return res.status(201).json(data);
    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
}

module.exports = self;


