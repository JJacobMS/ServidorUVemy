const router = require('express').Router();
const autenticacion = require('../controllers/autenticacion.controller');
const { checkSchema, body } = require('express-validator');
const validadorPeticionesSesion = require('../schemas/autenticacion.validadorpeticion');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');

router.post('/', body('correoElectronico').notEmpty().trim()
.isEmail()
.withMessage('Correo electrónico no válido'), body('contrasena').notEmpty()
.trim()
.withMessage('contraseña requerida'), validarFormatoPeticion(), autenticacion.iniciarSesion);

router.get('/tiempo', autenticacion.tiempo);

module.exports = router;