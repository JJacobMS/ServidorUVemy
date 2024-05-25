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
                options: (value) => {
                    if (value) {
                        const tamanoMaximo = 1 * 1024 * 1024; 
                        if (Array.isArray(value) && value.every(item => Number.isInteger(item)) && value.length > tamanoMaximo) {
                            throw new Error('La imagen debe tener un tamaño de 1MB o menos');
                        }
                    }
                    return true;
                },
                errorMessage: 'Etiquetas inválidas',
                bail: true
            }
        }
    }
}

/*
archivo: {
            custom: {
                options: value => Array.isArray(value) && value.every(item => Number.isInteger(item) ),
                errorMessage: 'Archivo invalido',
                bail: true
            }
        }
        */

const actualizarCursoSchema = () =>{
    return {
        idCurso: {
            in: ['body'],
            notEmpty: true,
            isNumeric: true,
            notEmpty: {
                errorMessage: 'idCurso inválido',
                bail: true
            }
        },
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
    }
}

const estadisticaCursoSchema = ()=> {
    return {
        idCurso: {
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
        }
    }
}

const calificarCursoSchema = ()=> {
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
        idCurso: {
            in: ['body'],
            notEmpty: true,
            exists: true,
            isDecimal: {
                errorMessage: 'IdCurso debe ser un número'
            },
            errorMessage: 'IdCurso inválida'
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
        }
    }
}

module.exports = { crearCursoSchema, actualizarCursoSchema, estadisticaCursoSchema, inscripcionCursoSchema, calificarCursoSchema, obtenerCalificacionCursoSchema }