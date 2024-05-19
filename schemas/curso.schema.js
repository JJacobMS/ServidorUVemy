const crearCursoSchema = () =>{
    return {
        titulo: {
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 150 } },
            notEmpty: {
                errorMessage: 'Titulo inválido',
                bail: true
            }
        },
        descripcion:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 660 } },
            notEmpty: {
                errorMessage: 'Descripción inválida',
                bail: true
            }
        },
        objetivos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 600 } },
            notEmpty: {
                errorMessage: 'Objetivos inválidos',
                bail: true
            }
        },
        requisitos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 300 } },
            notEmpty: {
                errorMessage: 'Requisitos inválidos',
                bail: true
            }
        },
        idUsuario: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
            notEmpty: {
                errorMessage: 'IdUsuario inválida',
                bail: true
            }
        },
        etiquetas: {
            in: ['body'],
            notEmpty: {
                options: value => Array.isArray(value) && value.every(item => Number.isInteger(item)),
                errorMessage: 'Etiquetas inválidas',
                bail: true
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
            notEmpty: {
                errorMessage: 'Titulo inválido',
                bail: true
            }
        },
        descripcion:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 660 } },
            notEmpty: {
                errorMessage: 'Descripción inválida',
                bail: true
            }
        },
        objetivos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 600 } },
            notEmpty: {
                errorMessage: 'Objetivos inválidos',
                bail: true
            }
        },
        requisitos:{
            in: ['body'],
            notEmpty: true,
            isString:true,
            isLength: { options: { min: 1, max: 300 } },
            notEmpty: {
                errorMessage: 'Requisitos inválidos',
                bail: true
            }
        },
        etiquetas: {
            in: ['body'],
            notEmpty: {
                options: value => Array.isArray(value) && value.every(item => Number.isInteger(item)),
                errorMessage: 'Etiquetas inválidas'
            }
        },
        idDocumento: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
            notEmpty: {
                errorMessage: 'idDocumento inválido',
                bail: true
            }
        }
        //ARCHIVO
    }
}

module.exports = { crearCursoSchema, actualizarCursoSchema }