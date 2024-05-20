const router = require('express').Router();
const documentos = require('../controllers/documentos.controller');
const autorizacion = require('../middlewares/autenticacion.middleware');
const { checkSchema } = require('express-validator');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { crearDocumentoSchema, validarFile, actualizarDocumentoSchema, eliminarDocumentoSchema } = require('../schemas/documento.schema');
const { subirArchivoPDF } = require("../middlewares/upload.middleware")

const autorizar = autorizacion.autorizar;

//router.get('/', documentos.getAll);

router.post('/clase', autorizar(), subirArchivoPDF.single("file"), checkSchema(crearDocumentoSchema()), validarFormatoPeticion, validarFile(), documentos.crear);

router.put('/clase/:id', subirArchivoPDF.single("file"), checkSchema(actualizarDocumentoSchema()), validarFormatoPeticion, validarFile(), documentos.actualizarDocumentoClase);

router.delete('/clase/:id', checkSchema(eliminarDocumentoSchema()), validarFormatoPeticion, documentos.eliminarDocumentoClase);

module.exports = router;