const router = require('express').Router();
const usuarioscursos = require('../controllers/usuarioscursos.controller');

router.get('/', usuarioscursos.getAll);

router.get('/:id', usuarioscursos.get);

router.post('/', usuarioscursos.create);

router.put('/:id', usuarioscursos.update);

router.delete('/:id', usuarioscursos.delete);

module.exports = router;