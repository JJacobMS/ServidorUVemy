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
    let nombreEtiqueta = req.body.nombre;
    let nombreNormalizado = nombreEtiqueta
        .toLowerCase() 
        .trim()
        .replace(/\s+/g, ' ');
    
    const etiquetaExistente = await etiquetas.findOne({ where: { nombre: nombreNormalizado } });
    if (etiquetaExistente) {
      return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: 'Ya existe una etiqueta con el mismo nombre' });
    }

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

    const cursosAsociados = await etiqueta.getCursos();
    if (cursosAsociados.length > 0) {
      return res.status(CodigosRespuesta.FORBIDDEN).json({ error: 'La etiqueta está asociada a uno o más cursos' });
    }

    const usuariosAsociados = await etiqueta.getUsuarios();
    if (usuariosAsociados.length > 0) {
      return res.status(CodigosRespuesta.FORBIDDEN).json({ error: 'La etiqueta está asociada a uno o más usuarios' });
    }

    await etiqueta.destroy({ where: { idEtiqueta: id } });
    return res.status(CodigosRespuesta.NO_CONTENT).send();
  } catch (error) {
    return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = self;
