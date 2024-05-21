const router = require('express').Router();
const clases = require('../controllers/clases.controller');
const { checkSchema } = require('express-validator');
const { crearClaseSchema, actualizarClaseSchema, recuperarClaseSchema } = require('../schemas/clase.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autenticacion.middleware');

const autorizar = autorizacion.autorizar;

router.get('/:id', checkSchema(recuperarClaseSchema()), validarFormatoPeticion, clases.obtenerPorId);

router.get('/curso/:idCurso', autorizar(), clases.obtenerPorCurso);

router.post('/', checkSchema(crearClaseSchema()), validarFormatoPeticion, clases.crear);

router.put('/:idClase', checkSchema(actualizarClaseSchema()), validarFormatoPeticion, clases.actualizar);

router.delete('/:id', checkSchema(recuperarClaseSchema()), validarFormatoPeticion, clases.eliminar);

module.exports = router;