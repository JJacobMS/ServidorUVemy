const router = require('express').Router();
const cursoslistas = require('../controllers/cursoslistas.controller');
const autorizacion = require('../middlewares/autenticacion.middleware');

const autorizar = autorizacion.autorizar;

router.get('/:id',autorizar(), cursoslistas.get);

module.exports = router