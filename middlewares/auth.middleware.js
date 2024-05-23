const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const claimTypes = require('../config/claimtypes');
const { generaToken } = require('../services/jwttoken.service');

const authorize = () => {
    return async (req, res, next) => {
        try {
            const encabezadoAuth = req.header('Authorization');
            if (!encabezadoAuth.startsWith('Bearer '))
                return res.status(401).json();

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
            return res.status(401).json();
        }
    }
}

module.exports = authorize;