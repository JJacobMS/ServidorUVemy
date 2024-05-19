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