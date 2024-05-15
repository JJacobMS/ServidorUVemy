const router = require('express').Router();
const clases = require('../controllers/clases.controller');
const autorizar = require('../middlewares/autenticacion.middleware');
const { checkSchema } = require('express-validator');
const { crearClaseSchema } = require('../schemas/clase.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');



router.get('/:id', autorizar(), clases.obtenerPorId);
router.get('/curso/:idCurso', autorizar(), clases.obtenerPorCurso);
router.post('/', autorizar(), checkSchema(crearClaseSchema()), validarFormatoPeticion, clases.crear);

module.exports = router;