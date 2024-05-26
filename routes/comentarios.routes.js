const router = require('express').Router();
const { checkSchema } = require('express-validator');
const comentarios = require('../controllers/comentarios.controller');
const { autorizar, autorizarIdClase } = require('../middlewares/autorizacion.middleware');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const validarCamposPeticion = require('../middlewares/validadorformatopeticiones.middleware');
const { crearComentarioSchema } = require('../schemas/comentario.schema');

router.get('/:idClase', autorizar(), autorizarIdClase("Profesor,Estudiante"), comentarios.get);
router.post('/', autorizar(), 
    checkSchema(crearComentarioSchema()), validarFormatoPeticion, validarCamposPeticion(crearComentarioSchema()),
    autorizarIdClase("Profesor,Estudiante"),
    comentarios.create);

module.exports = router;