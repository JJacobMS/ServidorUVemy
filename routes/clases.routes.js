const router = require('express').Router();
const clases = require('../controllers/clases.controller');
const { checkSchema } = require('express-validator');
const { crearClaseSchema, actualizarClaseSchema, recuperarClaseSchema } = require('../schemas/clase.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autorizacion.middleware');

router.get('/:idClase', checkSchema(recuperarClaseSchema()), validarFormatoPeticion,  autorizacion.autorizar(), autorizacion.autorizarProfesorOEstudianteIdClase(), clases.obtenerPorId);

//router.get('/curso/:idCurso', clases.obtenerPorCurso);

router.post('/', checkSchema(crearClaseSchema()), validarFormatoPeticion, autorizacion.autorizar(), autorizacion.autorizarProfesorIdCurso(), clases.crear);

router.put('/:idClase', checkSchema(actualizarClaseSchema()), validarFormatoPeticion,  autorizacion.autorizar(), autorizacion.autorizarProfesorIdClase(), clases.actualizar);

router.delete('/:idClase', checkSchema(recuperarClaseSchema()), validarFormatoPeticion, autorizacion.autorizar(), autorizacion.autorizarProfesorIdClase(), clases.eliminar);

module.exports = router;