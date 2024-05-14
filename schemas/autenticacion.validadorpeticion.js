const { body } = require('express-validator');

const inicioSesionSchema = () => {
    console.log("Validando esquema inicio de sesión");
    return [
        body("correoElectronico").notEmpty()
            .trim().isEmail().withMessage("Correo electrónico no válido"),
        body("contrasena").notEmpty().withMessage("Contraseña requerida")
    ];
}

module.exports = inicioSesionSchema;