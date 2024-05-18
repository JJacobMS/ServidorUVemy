const router = require('express').Router();
const autenticacion = require('../controllers/autenticacion.controller');
const { checkSchema } = require('express-validator');
const esquemas = require('../schemas/autenticacion.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { autorizarVerificacionCorreo } = require('../middlewares/autenticacion.middleware');

router.post('/', checkSchema(esquemas.inicioSesionSchema()), validarFormatoPeticion, autenticacion.iniciarSesion);

router.post('/verificacion', checkSchema(esquemas.solicitarVerificacionCorreoEsquema()), validarFormatoPeticion, autenticacion.solicitarCodigoVerificacionCorreo);

router.post('/registro', checkSchema(esquemas.registrarUsuarioEsquema()), validarFormatoPeticion, autorizarVerificacionCorreo(), autenticacion.registrarUsuario);

router.get('/tiempo', autenticacion.tiempo);

module.exports = router;