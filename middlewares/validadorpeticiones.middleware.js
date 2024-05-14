const { validationResult } = require('express-validator');

const validarFormatoPeticion = (req, res, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({
            exito: false,
            codigo: 400,
            detalles: errores.array().map(error => error.msg)
        });
    } else {
        next();
    }
}

module.exports = validarFormatoPeticion;