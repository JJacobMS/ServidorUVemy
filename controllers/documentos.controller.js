const { documentos } = require('../models');
let self = {}

self.getAll = async function(req, res){
    try{
        let data = await documentos.findAll({ attributes: ['idDocumento', 'archivo', 'nombre', 'idTipoArchivo', 'idCurso', 'idClase']})
        return res.status(200).json(data)
    }catch(error){
        return res.status(500).json(error)
    }
}

module.exports = self;
