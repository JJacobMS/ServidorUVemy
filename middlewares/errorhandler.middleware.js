const CodigosRespuesta = require("../utils/codigosRespuesta");

const errorHandler = (err, req, res, next) => {
    let mensaje = 'No se ha podido procesar la petición. Inténtelo de nuevo más tarde.';

    if (process.env.NODE_ENV === 'development') {
        const statusCode = err.statusCode || CodigosRespuesta.BAD_REQUEST;
        mensaje = err.message || mensaje;
        return res.status(statusCode).json({
            success: false,
            status: err.statusCode,
            mensaje: mensaje,
            stack: err.stack
        });
    }
    return res.status(CodigosRespuesta.BAD_REQUEST).send({ mensaje: mensaje });
}

module.exports = errorHandler;