const router = require('express').Router();
const documentos = require('../controllers/documentos.controller');
const autorizacion = require('../middlewares/autorizacion.middleware');
const { checkSchema } = require('express-validator');
const validarFormatoPeticion = require('../middlewares/validadorpeticiones.middleware');
const { crearDocumentoSchema, validarFile, actualizarDocumentoSchema, idDocumentoSchema } = require('../schemas/documento.schema');
const { subirArchivoPDF } = require("../middlewares/upload.middleware")

//router.get('/', documentos.getAll);

router.get('/clase/:idDocumento', checkSchema(idDocumentoSchema()), validarFormatoPeticion, autorizacion.autorizar(), autorizacion.autorizarProfesorOEstudianteIdDocumento(), documentos.obtenerArchivoPDF);

router.post('/clase', subirArchivoPDF.single("file"), checkSchema(crearDocumentoSchema()), validarFormatoPeticion, validarFile(), autorizacion.autorizar(), autorizacion.autorizarProfesorIdClase(), documentos.crear);

//router.put('/clase/:idDocumento', subirArchivoPDF.single("file"), checkSchema(actualizarDocumentoSchema()), validarFormatoPeticion, validarFile(), documentos.actualizarDocumentoClase);

router.delete('/clase/:idDocumento', checkSchema(idDocumentoSchema()), validarFormatoPeticion, autorizacion.autorizar(), autorizacion.autorizarProfesorIdDocumento(), documentos.eliminarDocumentoClase);

module.exports = router;