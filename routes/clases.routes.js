const router = require('express').Router();
const clases = require('../controllers/clases.controller');
const { checkSchema } = require('express-validator');
const { crearClaseSchema } = require('../schemas/clase.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autenticacion.middleware');

const autorizar = autorizacion.autorizar;

router.get('/:id', autorizar(), clases.obtenerPorId);
router.get('/curso/:idCurso', autorizar(), clases.obtenerPorCurso);
router.post('/', autorizar(), checkSchema(crearClaseSchema()), validarFormatoPeticion, clases.crear);

module.exports = router;