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
        const encabezadoAuth = req.header('Authorization');
        if (!encabezadoAuth.startsWith('Bearer'))
            return 0;
        
        const token = encabezadoAuth.split(' ')[1];
        const descifrado = jwt.verify(token, jwtSecret);

        const tiempo = (decodedToken.exp - (new Date().gettiempo() / 1000));
        const minutos = Math.floor(tiempo / 60);
        const segundos = Math.floor(tiempo - minutos * 60);

        return "00:" + minutos.toString().padStart(2, "0") + ':' + segundos.toString().padStart(2, "0");
    } catch (error) {
        return null;
    }
}

const generarTokenRegistro = (correoElectronico, codigo) => {
    const token = jwt.sign({
        [ClaimTypes.Email]: correoElectronico,
        [ClaimTypes.CodigoVerificacion]: codigo
    }, jwtSecret, {
        expiresIn: '1d'
    });
    return token;
}

module.exports = { generaToken, tiempoRestanteToken, generarTokenRegistro };