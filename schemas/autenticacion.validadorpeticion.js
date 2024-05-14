const { body } = require('express-validator');

class validadorPeticionesSesion {
    static inicioSesionSchema() {
        return [
            body('correoElectronico')
                .notEmpty()
                .trim()
                .isEmail()
                .withMessage('Correo electrónico no válido'),
            body('contrasena')
                .notEmpty()
                .trim()
                .withMessage('contraseña requerida')
        ];
    }
}

module.exports = { validadorPeticionesSesion } ;
