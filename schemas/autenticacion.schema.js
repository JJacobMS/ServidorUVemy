const inicioSesionSchema = ()  => {
    return {
        correoElectronico: {
            in: ['body'],
            trim: true,
            isEmail: true,
            errorMessage: 'Correo electrónico inválido',
        },
        contrasena: {
            in: ['body'],
            trim: true,
            notEmpty: true,
            errorMessage: 'Contraseña requerida',
        },
    }
}

module.exports = inicioSesionSchema;