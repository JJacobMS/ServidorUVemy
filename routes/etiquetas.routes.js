const router = require('express').Router();
const etiquetas = require('../controllers/etiquetas.controller');

router.get('/', etiquetas.getAll);

module.exports = router;