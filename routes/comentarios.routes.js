const router = require('express').Router();
const comentarios = require('../controllers/comentarios.controller');

router.get('/:idClase', comentarios.get);
router.post('/', comentarios.create);

module.exports = router;