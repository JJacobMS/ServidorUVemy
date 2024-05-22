let self = {};

self.inicioSesionSchema = () => {
    return {
        correoElectronico: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'Correo electrónico es requerido',
                bail: true,
            },
            trim: true,
            escape: true,
            isEmail: {
                errorMessage: 'Correo electrónico inválido',
                bail: true,
            },
        },
        contrasena: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'Contraseña es requerida',
                bail: true,
            },
            trim: true,
            escape: true,
            isLength: {
                options: { min: 3, max: 18 },
                errorMessage: 'Contraseña debe tener entre 3 y 18 caracteres',
                bail: true,
            },
        },
    }
}

module.exports = self;