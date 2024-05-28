const { clases, cursos, documentos, tiposarchivos } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.obtenerPorId = async function(req, res){        
    const idClase = req.params.idClase;
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

self.crear = async function(req, res){
    try{
        const data = await clases.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            idCurso: req.body.idCurso
        });

        if(data == null) return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error al crear la clase");

        return res.status(CodigosRespuesta.OK).json(data);
    }catch(error){
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json(error);
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
    const idClase = req.params.idClase;
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


