const { validationResult } = require('express-validator');
const CodigosRespuesta = require('../utils/codigosRespuesta');

const validarCamposPeticion = (schema) => {
    return (req, res, next) => {
        let bodyKeys = Object.keys(req.body);
        let allowedKeys = Object.keys(schema);
        let additionalKeys = bodyKeys.filter(key => !allowedKeys.includes(key));
        
        if (additionalKeys.length > 0) {
            return  res.status(CodigosRespuesta.BAD_REQUEST).json({
                exito: false,
                codigo: CodigosRespuesta.BAD_REQUEST,
                detalles: { error: `Propiedades adicionales no permitidas: ${additionalKeys.join(', ')}`}
            });
        }
        next();
    }
}

module.exports = validarCamposPeticion;