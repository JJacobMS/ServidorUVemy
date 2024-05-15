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

module.exports = { crearClaseSchema }