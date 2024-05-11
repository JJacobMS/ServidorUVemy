const router = require('express').Router();
const cursos = require('../controllers/cursos.controller');

router.get('/', cursos.getAll);

router.get('/:id', cursos.get);

router.post('/', cursos.create);

router.put('/:id', cursos.update);

router.delete('/:id', cursos.delete);

module.exports = router