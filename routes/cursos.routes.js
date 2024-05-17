const router = require('express').Router();
const cursos = require('../controllers/cursos.controller');
const autorizar = require('../middlewares/autenticacion.middleware');
const { checkSchema } = require('express-validator');
const { crearCursoSchema, actualizarCursoSchema } = require('../schemas/curso.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const validarCamposPeticion = require('../middlewares/validadorformatopeticiones.middleware');

router.get('/', autorizar(), cursos.getAll);

router.get('/:id',autorizar(), cursos.get);

router.post('/', autorizar(), checkSchema(crearCursoSchema()), validarFormatoPeticion, validarCamposPeticion(crearCursoSchema()), cursos.create);

router.put('/:id',autorizar(), checkSchema(actualizarCursoSchema()), validarFormatoPeticion,validarCamposPeticion(actualizarCursoSchema()),  cursos.update);

router.delete('/:id',autorizar(), cursos.delete);

module.exports = router