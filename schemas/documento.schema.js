const { TAMANIO_MAXIMO_DOCUMENTOS_KB } = require('../utils/tamanioDocumentos');
const CodigosRespuesta = require('../utils/codigosRespuesta');

const validarFile = () =>{
    return (req, res, next) => {   
        try {
            if(req.file == null){
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: 'El archivo es obligatorio' });
            }
        
            if (req.file.buffer == null) {
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: 'El archivo en el documento debe ser bytes no vacío' });
            }
            
            if (!req.file.mimetype.startsWith("application/pdf") || !req.file.originalname.endsWith(".pdf")) {
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: 'El archivo en el documento debe PDF' });
            }

            const tamanioKB = req.file.size / 1024;
            if (tamanioKB > TAMANIO_MAXIMO_DOCUMENTOS_KB) {
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: "El tamaño del archivo excede el límite de 1MB" });
            }

        } catch (error) {
            console.log(error);
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ error: error.message });
        }
    
        next();
    };
}

const crearDocumentoSchema = () =>{
    return {
        idClase: {
            in: ['body'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'IdClase debe ser un número'
            },
            errorMessage: 'IdClase inválida'
        },
        nombre: {
            in: ['body'],
            notEmpty: true,
            isLength: { options: { min: 1, max: 35 } },
            errorMessage: 'Nombre archivo inválido'
        }
    }
}

const actualizarDocumentoSchema = () =>{
    return {
        id: {
            in: ['params'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'IdDocumento debe ser un número'
            },
            errorMessage: 'IdDocumento inválida'
        },
        idDocumento: {
            in: ['body'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'IdDocumento debe ser un número'
            },
            errorMessage: 'IdDocumento inválida'
        },
        nombre: {
            in: ['body'],
            notEmpty: true,
            isLength: { options: { min: 1, max: 35 } },
            errorMessage: 'Nombre archivo inválido'
        }
    }
}

const eliminarDocumentoSchema = () =>{
    return {
        id: {
            in: ['params'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'IdDocumento debe ser un número'
            },
            errorMessage: 'IdDocumento inválida'
        }
    }
}

module.exports = { crearDocumentoSchema, validarFile, actualizarDocumentoSchema, eliminarDocumentoSchema }