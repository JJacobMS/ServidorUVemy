const { validationResult } = require('express-validator');
const CodigosRespuesta = require('../utils/codigosRespuesta');

const validarFormatoPeticion = (req, res, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(CodigosRespuesta.BAD_REQUEST).json({
            detalles: errores.array().map(error => error.msg)
        });
    } else {
        next();
    }
}

module.exports = validarFormatoPeticion;