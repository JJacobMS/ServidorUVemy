const bcrypt = require('bcrypt');
const { usuarios, Sequelize } = require('../models');
const { generaToken, tiempoRestanteToken } = require('../services/jwttoken.service');

let self = {};

self.iniciarSesion = async function (req, res) {
    try{
        const { correoElectronico, contrasena } = req.body;

        let data = await usuarios.findOne({
            where: { correoElectronico: correoElectronico },
            raw: true,
            attributes: ['idUsuario', 'correoElectronico', 'contrasena', 'nombres', 'apellidos']
        });

        if (data === null)
            return res.status(401).send({ message: "Correo electrónico o contraseña incorrectos" });

        const contraenaValida = await bcrypt.compare(contrasena, data.contrasena);
        if (!contraenaValida)
            return res.status(401).send({ message: "Correo electrónico o contraseña incorrectos" });

        token = generaToken(data.correoElectronico, data.nombres);
        return res.status(200).json({
            idUsuario: data.idUsuario,
            nombres: data.nombres,
            apellidos: data.apellidos,
            correoElectronico: data.correoElectronico,
            jwt: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

self.tiempo = async function (req, res) {
    const tiempo = tiempoRestanteToken(req);
    if (tiempo == null)
        return res.status(404).send();
    
    return res.status(200).send(tiempo);
}

module.exports = self;