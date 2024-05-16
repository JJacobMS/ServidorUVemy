const router = require('express').Router();
const autenticacion = require('../controllers/autenticacion.controller');
const { checkSchema } = require('express-validator');
const esquemas = require('../schemas/autenticacion.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');

router.post('/', checkSchema(esquemas.inicioSesionSchema()), validarFormatoPeticion, autenticacion.iniciarSesion);

router.post('/registro', checkSchema(esquemas.usuarioEsquema()), validarFormatoPeticion, autenticacion.registrarUsuario);

router.get('/tiempo', autenticacion.tiempo);

module.exports = router;