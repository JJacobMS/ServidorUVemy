const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const ClaimTypes = require('../config/claimtypes');

const generaToken = (idUsuario, correoElectronico, nombre) => {
    const token = jwt.sign({
        [ClaimTypes.Id]: idUsuario,
        [ClaimTypes.Email]: correoElectronico,
        [ClaimTypes.GivenName]: nombre,
        "iss": "UVemyServidorJWT",
        "aud": "UsuariosUVemyJWT"
    }, 
        jwtSecret, { 
            expiresIn: '20m' 
    });
    return token;
}
const tiempoRestanteToken = (req) => {
    try{
        const authHeader = req.header('Authorization');
        if (!authHeader.startsWith('Bearer'))
            return 0;
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);

        const time = (decodedToken.exp - (new Date().getTime() / 1000));
        const minutos = Math.floor(time / 60);
        const segundos = Math.floor(time - minutos * 60);

        return "00:" + minutos.toString().padStart(2, "0") + ':' + segundos.toString().padStart(2, "0");
    } catch (error) {
        return null;
    }
}

module.exports = { generaToken, tiempoRestanteToken };