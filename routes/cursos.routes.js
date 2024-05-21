const router = require('express').Router();
const cursos = require('../controllers/cursos.controller');
const cursosEstadisticas = require('../controllers/estadisticas.controller');
const cursosInscripcion = require('../controllers/inscripcion.controller');
const autorizacion = require('../middlewares/autorizacion.middleware');
const { checkSchema } = require('express-validator');
const { crearCursoSchema, actualizarCursoSchema, estadisticaCursoSchema, inscripcionCursoSchema, calificarCursoSchema, obtenerCalificacionCursoSchema } = require('../schemas/curso.schema');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const validarCamposPeticion = require('../middlewares/validadorformatopeticiones.middleware');

const autorizar = autorizacion.autorizar;

router.get('/', autorizar(), cursos.getAll);

router.get('/:id',autorizar(), cursos.get);

router.post('/', autorizar(), checkSchema(crearCursoSchema()), validarFormatoPeticion, validarCamposPeticion(crearCursoSchema()), cursos.create);

router.put('/:id',autorizar(), checkSchema(actualizarCursoSchema()), validarFormatoPeticion,validarCamposPeticion(actualizarCursoSchema()),  cursos.update);

router.delete('/:id',autorizar(), cursos.delete);

router.get('/estadisticas/:id', checkSchema(estadisticaCursoSchema()), validarFormatoPeticion, cursosEstadisticas.obtenerEstadisticasCurso);

router.get('/reporte/:id', checkSchema(estadisticaCursoSchema()), validarFormatoPeticion, cursosEstadisticas.devolverReporte);

router.post('/inscripcion/:id', checkSchema(inscripcionCursoSchema()), validarFormatoPeticion, cursosInscripcion.inscribirse);

router.post('/calificacion/:id', checkSchema(calificarCursoSchema()), validarFormatoPeticion, cursosInscripcion.calificarCurso);

router.get('/calificacion/:idCurso/:idUsuario',checkSchema(obtenerCalificacionCursoSchema()), validarFormatoPeticion, cursosInscripcion.obtenerCalificacionUsuarioCurso);

module.exports = router