const router = require('express').Router();
const autenticacion = require('../controllers/autenticacion.controller');
const { checkSchema } = require('express-validator');
const esquemas = require('../schemas/autenticacion.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { autorizarVerificacionCorreo } = require('../middlewares/autorizacion.middleware');
const multer = require('multer');
const { validarFile } = require('../schemas/documento.schema');
const upload = multer({ dest: 'uploads/' });

router.post('/', checkSchema(esquemas.inicioSesionSchema()), validarFormatoPeticion, autenticacion.iniciarSesion);

router.get('/tiempo', autenticacion.tiempo);

module.exports = router;