const { clases } = require('../models');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await clases.findAll({ attributes: ['idClase', 'nombre', 'descripcion', 'idCurso']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

module.exports = self;


