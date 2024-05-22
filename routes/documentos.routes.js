const router = require('express').Router();
const documentos = require('../controllers/documentos.controller');
const autorizacion = require('../middlewares/autorizacion.middleware');
const { checkSchema } = require('express-validator');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { crearDocumentoSchema, validarFile, actualizarDocumentoSchema, idDocumentoSchema } = require('../schemas/documento.schema');
const { subirArchivoPDF } = require("../middlewares/upload.middleware")

const autorizar = autorizacion.autorizar;

//router.get('/', documentos.getAll);

router.get('/clase/:id', checkSchema(idDocumentoSchema()), validarFormatoPeticion, documentos.obtenerArchivoPDF);

router.post('/clase', subirArchivoPDF.single("file"), checkSchema(crearDocumentoSchema()), validarFormatoPeticion, validarFile(), documentos.crear);

router.put('/clase/:id', subirArchivoPDF.single("file"), checkSchema(actualizarDocumentoSchema()), validarFormatoPeticion, validarFile(), documentos.actualizarDocumentoClase);

router.delete('/clase/:id', checkSchema(idDocumentoSchema()), validarFormatoPeticion, documentos.eliminarDocumentoClase);

module.exports = router;