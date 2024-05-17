const { etiquetas } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await etiquetas.findAll({ attributes: ['idEtiqueta', 'nombre']})
        return res.status(CodigosRespuesta.OK).json(data)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json(error)
    }
}

module.exports = self;