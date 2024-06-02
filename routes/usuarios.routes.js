const router = require('express').Router();
const usuarios = require('../controllers/usuarios.controller');
const { checkSchema } = require('express-validator');
const { recuperarUsuarioSchema } = require('../schemas/usuario.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autorizacion.middleware');

const autorizar = autorizacion.autorizar;

router.get('/:pagina', autorizar(), checkSchema(recuperarUsuarioSchema()), validarFormatoPeticion, usuarios.getAll);

module.exports = router;