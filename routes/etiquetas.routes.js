const router = require('express').Router();
const etiquetas = require('../controllers/etiquetas.controller');

router.get('/', etiquetas.getAll);

router.post('/', etiquetas.create);

router.delete('/:id', etiquetas.delete);

module.exports = router;