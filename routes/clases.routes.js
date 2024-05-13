const router = require('express').Router();
const clases = require('../controllers/clases.controller');

router.get('/', clases.getAll);
router.post('/', clases.create);

module.exports = router;