let self = {};

self.inicioSesionSchema = ()  => {
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

self.usuarioEsquema = () => {
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
            matches: {
                options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                errorMessage: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
            },
            errorMessage: 'Contraseña requerida',
        },
        nombres: {
            in: ['body'],
            trim: true,
            notEmpty: true,
            errorMessage: 'Nombres requeridos',
        },
        apellidos: {
            in: ['body'],
            trim: true,
            notEmpty: true,
            errorMessage: 'Apellidos requeridos',
        },
        idsEtiqueta: {
            in: ['body'],
            isArray: true,
            optional: true,
            custom: {
                options: (value) => value.every((element) => typeof element === 'number'),
                errorMessage: 'Etiquetas deben ser un arreglo de números',
            },
            customSanitizer: {
                options: (value) => value.map(Number),
            },
            errorMessage: 'Etiquetas deben ser un arreglo de números',
            notEmpty: true,
            errorMessage: 'Etiquetas requeridas'
        },
    }
}

module.exports = self;