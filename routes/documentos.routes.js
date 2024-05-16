const router = require('express').Router();
const documentos = require('../controllers/documentos.controller');
const autorizar = require('../middlewares/autenticacion.middleware');
const { checkSchema } = require('express-validator');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { crearDocumentoSchema, validarFile } = require('../schemas/documento.schema');
const { subirArchivoPDF } = require("../middlewares/upload.middleware")



router.get('/', documentos.getAll);
router.post('/', autorizar(), subirArchivoPDF.single("file"), checkSchema(crearDocumentoSchema()), validarFormatoPeticion, validarFile(), documentos.crear);

module.exports = router;