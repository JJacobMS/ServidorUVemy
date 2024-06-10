const router = require('express').Router();
const usuarios = require('../controllers/usuarios.controller');
const { checkSchema } = require('express-validator');
const { recuperarUsuarioSchema, recuperarUsuariosBusquedaSchema } = require('../schemas/usuario.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const autorizacion = require('../middlewares/autorizacion.middleware');

const autorizarAdmin = autorizacion.autorizarAdmin;

router.get('/:pagina', autorizarAdmin(), checkSchema(recuperarUsuarioSchema()), validarFormatoPeticion, usuarios.getAll);
router.get('/buscar/:pagina', autorizarAdmin(), checkSchema(recuperarUsuariosBusquedaSchema()), validarFormatoPeticion, usuarios.getAllBusqueda);

module.exports = router;