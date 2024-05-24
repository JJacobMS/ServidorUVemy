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

self.create = async function(req, res) {
    try {
        let data = await etiquetas.create({
            nombre: req.body.nombre
        });
        return res.status(CodigosRespuesta.CREATED).json(data);
    } catch (error) {
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

self.delete = async function(req, res) {
    try {
      let id = req.params.id;
      let etiqueta = await etiquetas.findByPk(id);
      if (!etiqueta) {
        return res.status(CodigosRespuesta.NOT_FOUND).send();
      }
      await etiqueta.destroy({ where: { idEtiqueta: id } });
      return res.status(CodigosRespuesta.NO_CONTENT).send();
    } catch (error) {
      return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

module.exports = self;