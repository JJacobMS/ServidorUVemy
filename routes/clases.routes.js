const router = require('express').Router();
const clases = require('../controllers/clases.controller');

router.get('/', clases.getAll);

module.exports = router;