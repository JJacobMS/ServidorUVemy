const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const claimTypes = require('../config/claimtypes');
const { generaToken } = require('../services/jwttoken.service');
const CodigosRespuesta = require('../utils/codigosRespuesta');

let self = {};

self.autorizar = () => {
    return async (req, res, next) => {
        try {
            const encabezadoAuth = req.header('Authorization');
            if (!encabezadoAuth.startsWith('Bearer '))
                return res.status(CodigosRespuesta.UNAUTHORIZED).json();

            const token = encabezadoAuth.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);

            req.tokenDecodificado = tokenDecodificado;

            var minutosRestantes = (tokenDecodificado.exp - (new Date().getTime() / 1000)) / 60;
            if (minutosRestantes < 5) {
                var nuevoToken = generaToken(tokenDecodificado[claimTypes.Email], tokenDecodificado[claimTypes.GivenName]);
                res.header("Set-Authorization", nuevoToken);
            }
            next();
        } catch (error) {
            return res.status(CodigosRespuesta.UNAUTHORIZED).json();
        }
    }
}

self.autorizarVerificacionCorreo = () => {
    return async (req, res, next) => {
        try {
            const encabezadoAuth = req.header('Authorization');
            if (!encabezadoAuth.startsWith('Bearer '))
                return res.status(CodigosRespuesta.UNAUTHORIZED).json({ detalles: ['Token de autorización no válido'] });

            const token = encabezadoAuth.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);

            if (tokenDecodificado[claimTypes.CodigoVerificacion] !== req.body.codigoVerificacion || 
                tokenDecodificado[claimTypes.Email] !== req.body.correoElectronico) {
                return res.status(CodigosRespuesta.UNAUTHORIZED).json({ detalles: ['Código de verificación incorrecto'] });
            }

            req.tokenDecodificado = tokenDecodificado;

            next();
        } catch (error) {
            return res.status(CodigosRespuesta.UNAUTHORIZED).json({ detalles: ['Error al verificar el token de autorización'] });
        }
    }
}


module.exports = self;