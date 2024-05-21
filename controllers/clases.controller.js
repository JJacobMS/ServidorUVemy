const { clases, cursos, documentos, tiposarchivos } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.obtenerPorId = async function(req, res){        
    const idClase = req.params.id;
    try{
        let clase = await clases.findOne({ where: {idClase: idClase}, attributes: ['idClase', 'nombre', 'descripcion', 'idCurso']})
        if(clase == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Clase no encontrada");
        }
        let documentosClase = await documentos.findAll({ 
            where: {idClase: idClase, '$tiposarchivos.nombre$': "application/pdf"}, 
            attributes: ['idDocumento'],
            include: { model: tiposarchivos, as: 'tiposarchivos', attributes: []}
        });

        let documentosID = [];
        for(var item of documentosClase){
            documentosID.push(item.idDocumento);
        }

        clase.dataValues.documentosId = documentosID;

        let videoClase = await documentos.findOne({ 
            where: {idClase: idClase, '$tiposarchivos.nombre$': "video/mp4"}, 
            attributes: ['idDocumento'],
            include: { model: tiposarchivos, as: 'tiposarchivos', attributes: []}
        });

        if(videoClase != null){
            clase.dataValues.videoId = videoClase.dataValues.idDocumento;
        }
    
        return res.status(CodigosRespuesta.OK).json(clase);
    }catch(error){
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json(error)
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

self.actualizar = async function(req, res){
    const idClase = req.body.idClase;
    if(idClase != req.params.idClase){
        return res.status(CodigosRespuesta.BAD_REQUEST).send("IdClase deben ser iguales");
    }

    try{
        let clase = await clases.findOne({ where: { idClase: idClase }});
        if(clase == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Clase no existente");
        }
        
        clase.nombre = req.body.nombre;
        clase.descripcion = req.body.descripcion;
        await clase.save();       

        return res.status(CodigosRespuesta.OK).json(clase);
    }catch(error){
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json(error);
    }
}

self.eliminar = async function(req, res){        
    const idClase = req.params.id;
    try{
        let clase = await clases.findOne({ where: {idClase: idClase}, attributes: ['idClase', 'nombre', 'descripcion', 'idCurso']})
        if(clase == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Clase no encontrada");
        }
        
        await clase.destroy();
        return res.status(CodigosRespuesta.OK).send()
    }catch(error){
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json(error)
    }
}

module.exports = self;


