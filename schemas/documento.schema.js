const { TAMANIO_MAXIMO_DOCUMENTOS_KB } = require('../utils/tamanioDocumentos')

const validarFile = () =>{
    return (req, res, next) => {   
        if(req.file == null){
            return res.status(400).json({ error: 'El archivo es obligatorio' });
        }
    
        if (req.file.buffer == null) {
            return res.status(400).json({ error: 'El archivo en el documento debe ser bytes no vacío' });
        }
    
        try {
            if (!req.file.mimetype.startsWith("application/pdf") || !req.file.originalname.endsWith(".pdf")) {
                return res.status(400).json({ error: 'El archivo en el documento debe PDF' });
            }
    
            const tamanioKB = req.file.size / 1024;
            if (tamanioKB > TAMANIO_MAXIMO_DOCUMENTOS_KB) {
                return res.status(400).json({ error: "El tamaño del archivo excede el límite de 1MB" });
            }

        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: error.message });
        }
    
        next();
    };
}

const crearDocumentoSchema = () =>{
    return {
        idClase: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
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

module.exports = { crearDocumentoSchema, validarFile }