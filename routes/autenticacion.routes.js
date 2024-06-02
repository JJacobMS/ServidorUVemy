const router = require('express').Router();
const autenticacion = require('../controllers/autenticacion.controller');
const { checkSchema } = require('express-validator');
const esquemas = require('../schemas/autenticacion.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { autorizarVerificacionCorreo } = require('../middlewares/autorizacion.middleware');
const multer = require('multer');
const { validarFile } = require('../schemas/documento.schema');
const validarCamposPeticion = require('../middlewares/validadorformatopeticiones.middleware');
const upload = multer({ dest: 'uploads/' });

router.post('/', checkSchema(esquemas.inicioSesionSchema()), validarFormatoPeticion, validarCamposPeticion(esquemas.inicioSesionSchema()), autenticacion.iniciarSesion);

router.get('/tiempo', autenticacion.tiempo);

module.exports = router;