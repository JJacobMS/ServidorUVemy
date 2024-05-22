const router = require('express').Router();
const cursosetiquetas = require('../controllers/cursosetiquetas.controller');

router.get('/', cursosetiquetas.getAll);

router.get('/:id', cursosetiquetas.get);

router.post('/', cursosetiquetas.create);

router.put('/:id', cursosetiquetas.update);

router.delete('/:id', cursosetiquetas.delete);

module.exports = router