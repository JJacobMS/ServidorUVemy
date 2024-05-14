const router = require('express').Router();
const clases = require('../controllers/clases.controller');
const autorizar = require('../middlewares/autenticacion.middleware');

router.get('/:id', autorizar(), clases.obtenerPorId);
router.get('/curso/:idCurso', autorizar(), clases.obtenerPorCurso);
router.post('/', autorizar(), clases.create);

module.exports = router;