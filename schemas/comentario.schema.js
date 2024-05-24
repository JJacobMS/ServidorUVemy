const crearComentarioSchema = () => {
    return {
        idClase: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'idClase requerido',
                bail: true,
            },
            trim: true,
            escape: true,
            isInt: {
                options: { min: 1 },
                errorMessage: 'idClase debe ser un entero positivo',
                bail: true,
            }
        },
        idUsuario: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'idUsuario requerido',
                bail: true,
            },
            trim: true,
            escape: true,
            isInt: {
                options: { min: 1 },
                errorMessage: 'idUsuario debe ser un entero positivo',
                bail: true,
            }
        },
        descripcion: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'Descripción requerida',
                bail: true,
            },
            trim: true,
            escape: true,
            isLength: { 
                options: { max: 350 },
                errorMessage: 'Descripción debe ser menor a 350 caracteres',
                bail: true,
            },
        },
        respondeAComentario: {
            in: ['body'],
            optional: true,
            trim: true,
            escape: true,
            isInt: {
                options: { min: 1 },
                errorMessage: 'respondeAComentario debe ser un entero positivo',
                bail: true,
            }
        }
    }
}

module.exports = { crearComentarioSchema };