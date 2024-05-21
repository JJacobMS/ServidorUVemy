const router = require('express').Router();
const perfil = require('../controllers/perfil.controller');
const { checkSchema } = require('express-validator');
const esquemas = require('../schemas/perfil.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { autorizarVerificacionCorreo, autorizar } = require('../middlewares/autorizacion.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { validarFoto } = require('../schemas/perfil.schema');

router.post('/verificacion', checkSchema(esquemas.solicitarVerificacionCorreoEsquema()), validarFormatoPeticion, perfil.solicitarCodigoVerificacionCorreo);

router.post('/registro', checkSchema(esquemas.registrarUsuarioEsquema()), validarFormatoPeticion, autorizarVerificacionCorreo(), perfil.registrarUsuario);

router.put('/perfil/foto', autorizar(), upload.single("imagen"), checkSchema(esquemas.fotoPerfilSchema()), validarFormatoPeticion, validarFoto(), perfil.subirFotoPerfilUsuario);

module.exports = router;