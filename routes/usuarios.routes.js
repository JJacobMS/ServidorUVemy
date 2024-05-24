const router = require('express').Router();
const usuarios = require('../controllers/usuarios.controller');

router.get('/', usuarios.getAll);

router.get('/:id', usuarios.get);

router.post('/', usuarios.create);

router.put('/:id', usuarios.update);

router.delete('/:id', usuarios.delete);

module.exports = router;