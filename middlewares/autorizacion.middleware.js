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
                return res.status(CodigosRespuesta.UNAUTHORIZED).json({ mensaje: 'Token de autorización no válido' });

            const token = encabezadoAuth.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);

            if (tokenDecodificado.codigoVerificacion !== req.codigoVerificacion || tokenDecodificado.correoElectronico !== req.correoElectronico) {
                return res.status(CodigosRespuesta.UNAUTHORIZED).json({ mensaje: 'Código de verificación incorrecto' });
            }

            req.tokenDecodificado = tokenDecodificado;

            next();
        } catch (error) {
            return res.status(CodigosRespuesta.UNAUTHORIZED).json({ mensaje: 'Error al verificar el token de autorización' });
        }
    }
}


module.exports = self;