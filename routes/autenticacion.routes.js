const router = require('express').Router();
const autenticacion = require('../controllers/autenticacion.controller');
const { checkSchema } = require('express-validator');
const inicioSesionSchema = require('../schemas/autenticacion.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');

router.post('/', checkSchema(inicioSesionSchema()), validarFormatoPeticion, autenticacion.iniciarSesion);

router.get('/tiempo', autenticacion.tiempo);

module.exports = router;