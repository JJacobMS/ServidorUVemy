const crearCursoSchema = () =>{
    return {
        titulo: {
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 150 } },
            errorMessage: 'Titulo inválido'
        },
        descripcion:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 660 } },
            errorMessage: 'Descripción inválida'
        },
        objetivos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 600 } },
            errorMessage: 'Objetivos inválidos'
        },
        requisitos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 300 } },
            errorMessage: 'Requisitos inválidos'
        },
        idUsuario: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'IdUsuario inválida'
        },
        etiquetas: {
            in: ['body'],
            custom: {
                options: value => Array.isArray(value) && value.every(item => Number.isInteger(item)),
                errorMessage: 'Etiquetas inválidas'
            }
        },

        //ARCHIVO
    }
}

const actualizarCursoSchema = () =>{
    return {
        titulo: {
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 150 } },
            errorMessage: 'Titulo inválido'
        },
        descripcion:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 660 } },
            errorMessage: 'Descripción inválida'
        },
        objetivos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 600 } },
            errorMessage: 'Objetivos inválidos'
        },
        requisitos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 300 } },
            errorMessage: 'Requisitos inválidos'
        },
        etiquetas: {
            in: ['body'],
            custom: {
                options: value => Array.isArray(value) && value.every(item => Number.isInteger(item)),
                errorMessage: 'Etiquetas inválidas'
            }
        },
        idDocumento: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'idDocumento inválido'
        }
        //ARCHIVO
    }
}

module.exports = { crearCursoSchema, actualizarCursoSchema }