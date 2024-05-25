const router = require('express').Router();
const { checkSchema } = require('express-validator');
const { crearEtiquetaSchema } = require('../schemas/etiqueta.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autorizacion.middleware');
const etiquetas = require('../controllers/etiquetas.controller');

const autorizar = autorizacion.autorizar;

router.get('/', autorizar(), etiquetas.getAll);

router.post('/', autorizar(), checkSchema(crearEtiquetaSchema()), validarFormatoPeticion, etiquetas.create);

router.delete('/:id', autorizar(), etiquetas.delete);

module.exports = router;