const router = require('express').Router();
const documentos = require('../controllers/documentos.controller');

router.get('/', documentos.getAll);

router.post('/', documentos.create);

module.exports = router;