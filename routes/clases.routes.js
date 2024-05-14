const router = require('express').Router();
const clases = require('../controllers/clases.controller');
const authorize = require('../middlewares/auth.middleware');

router.get('/:id', authorize(), clases.obtenerPorId);
router.get('/curso/:idCurso', authorize(), clases.obtenerPorCurso);
router.post('/', authorize(), clases.create);

module.exports = router;