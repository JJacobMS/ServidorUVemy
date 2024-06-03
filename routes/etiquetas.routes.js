const router = require('express').Router();
const { checkSchema } = require('express-validator');
const { crearEtiquetaSchema } = require('../schemas/etiqueta.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autorizacion.middleware');
const etiquetas = require('../controllers/etiquetas.controller');

const autorizarAdmin = autorizacion.autorizarAdmin;

router.get('/', etiquetas.getAll);

router.post('/', autorizarAdmin(), checkSchema(crearEtiquetaSchema()), validarFormatoPeticion, etiquetas.create);

router.delete('/:id', autorizarAdmin(), etiquetas.delete);

module.exports = router;