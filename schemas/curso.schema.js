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

const estadisticaCursoSchema = ()=> {
    return {
        id: {
            in: ['params'],
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'IdCurso inválida'
        }
    }
}

const inscripcionCursoSchema = ()=> {
    return {
        id: {
            in: ['params'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdCurso debe ser un número'
            },
            errorMessage: 'IdCurso inválida'
        },
        idCurso: {
            in: ['body'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdCurso debe ser un número'
            },
            errorMessage: 'IdCurso inválida'
        },
        idUsuario: {
            in: ['body'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdUsuario debe ser un número'
            },
            errorMessage: 'IdUsuario inválida'
        }
    }
}

const calificarCursoSchema = ()=> {
    return {
        id: {
            in: ['params'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdCurso debe ser un número'
            },
            errorMessage: 'IdCurso inválida'
        },
        idCurso: {
            in: ['body'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdCurso debe ser un número'
            },
            errorMessage: 'IdCurso inválida'
        },
        idUsuario: {
            in: ['body'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdUsuario debe ser un número'
            },
            errorMessage: 'IdUsuario inválida'
        },
        calificacion:{
            in: ['body'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'Calificación debe ser un número'
            },
            custom: {
                options: (value)=>{
                    if(value < 1 || value > 10){
                        throw Error("Calificaicón debe ser un número entre 0 y 10");
                    }
                    return true;
                }
            },
            errorMessage: 'Calificación inválida'
        }
    }
}

const obtenerCalificacionCursoSchema = ()=> {
    return {
        idCurso: {
            in: ['params'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdCurso debe ser un número'
            },
            errorMessage: 'IdCurso inválida'
        },
        idUsuario: {
            in: ['params'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdUsuario debe ser un número'
            },
            errorMessage: 'IdUsuario inválida'
        }
    }
}

module.exports = { crearCursoSchema, actualizarCursoSchema, estadisticaCursoSchema, inscripcionCursoSchema, calificarCursoSchema, obtenerCalificacionCursoSchema }