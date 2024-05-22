const router = require('express').Router();
const perfil = require('../controllers/perfil.controller');
const { checkSchema } = require('express-validator');
const esquemas = require('../schemas/perfil.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { autorizarVerificacionCorreo, autorizar } = require('../middlewares/autorizacion.middleware');
const { subirArchivoPDF } = require("../middlewares/upload.middleware")
const { validarFoto } = require('../schemas/perfil.schema');

router.post('/verificacion', checkSchema(esquemas.solicitarVerificacionCorreoEsquema()), validarFormatoPeticion, perfil.solicitarCodigoVerificacionCorreo);

router.post('/registro', checkSchema(esquemas.registrarUsuarioEsquema()), validarFormatoPeticion, autorizarVerificacionCorreo(), perfil.registrarUsuario);

router.put('/foto', autorizar(), subirArchivoPDF.single("imagen"), checkSchema(esquemas.fotoPerfilSchema()), validarFormatoPeticion, validarFoto(), perfil.subirFotoPerfilUsuario);

router.put('/', autorizar(), checkSchema(esquemas.actualizarPerfilSchema()), validarFormatoPeticion, perfil.actualizarPerfilUsuario);

router.get('/foto', autorizar(), perfil.obtenerFotoPerfil);

module.exports = router;