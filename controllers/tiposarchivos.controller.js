const { tiposarchivos } = require('../models');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await tiposarchivos.findAll({ attributes: ['idTipoArchivo', 'nombre']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

module.exports = self;