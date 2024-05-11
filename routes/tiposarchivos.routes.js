const router = require('express').Router();
const tiposarchivos = require('../controllers/tiposarchivos.controller');

router.get('/', tiposarchivos.getAll);

module.exports = router;