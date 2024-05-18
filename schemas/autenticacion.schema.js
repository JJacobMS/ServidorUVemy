const { escape } = require("mysql2");

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

self.usuarioEsquema = () => {
    return {
        nombres: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'Nombres requeridos',
                bail: true,
            },
            trim: true,
            escape: true,
            isLength: { 
                options: { max: 150 },
                errorMessage: 'Nombre/s debe ser menor a 150 caracteres',
                bail: true,
            },
        },
        apellidos: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'Apellidos requeridos',
                bail: true,
            },
            trim: true,
            escape: true,
            isLength: { 
                options: { max: 660 },
                errorMessage: 'Apellido/s debe ser menor a 660 caracteres',
                bail: true,
            },
        },
        correoElectronico: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'Correo electrónico es requerido',
                bail: true,
            },
            trim: true,
            escape: true,
            isLength: {
                options: { max: 600 },
                errorMessage: 'Correo electrónico debe ser menor a 600 caracteres',
                bail: true,
            },
            isEmail:{
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
                options: { min: 3, max: 18},
                errorMessage: 'La contraseña debe tener entre 3 y 18 caracteres',
                bail: true, 
            },
            matches: {
                options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                errorMessage: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
                bail: true,
            },
        },
        idsEtiqueta: {
            in: ['body'],
            exists: {
                options: { checkFalsy: true },
                errorMessage: 'idsEtiqueta es requerido',
                bail: true,
            },
            custom: {
                options: (value) => Array.isArray(value),
                errorMessage: 'idsEtiqueta debe ser un arreglo',
                bail: true,
            },
            customSanitizer: {
                options: (value) => {
                    if (!value) return [];
                    return Array.isArray(value) ? value.map(Number) : [Number(value)];
                },
            },
            custom: {
                options: (value) => value.every((element) => typeof element === 'number'),
                errorMessage: 'idsEtiqueta debe ser un arreglo de números',
                bail: true,
            },
        },
    }
}

module.exports = self;