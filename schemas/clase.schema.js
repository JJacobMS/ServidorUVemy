const recuperarClaseSchema = () =>{
    return {
        idClase: {
            in: ['params'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'IdClase debe ser un número'
            },
            errorMessage: 'IdClase inválida'
        }
    }
}

const crearClaseSchema = () =>{
    return {
        idCurso: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'IdCurso inválida'
        },
        nombre: {
            in: ['body'],
            notEmpty: true,
            isLength: { options: { min: 1, max: 150 } },
            errorMessage: 'Nombre inválido'
        },
        descripcion:{
            in: ['body'],
            notEmpty: true,
            isLength: { options: { min: 1, max: 660 } },
            errorMessage: 'Descripción inválida'
        }
    }
}

const actualizarClaseSchema = () =>{
    return {
        idClase: {
            in: ['params'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'IdClase debe ser un número'
            },
            errorMessage: 'IdClase inválida'
        },
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
            isLength: { options: { min: 1, max: 150 } },
            errorMessage: 'Nombre inválido'
        },
        descripcion:{
            in: ['body'],
            notEmpty: true,
            isLength: { options: { min: 1, max: 660 } },
            errorMessage: 'Descripción inválida'
        }
    }
}

module.exports = { crearClaseSchema, actualizarClaseSchema, recuperarClaseSchema }