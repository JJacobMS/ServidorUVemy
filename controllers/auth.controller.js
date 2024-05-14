const bcrypt = require('bcrypt');
const { usuarios, Sequelize } = require('../models');
const { generaToken, tiempoRestanteToken } = require('../services/jwttoken.service');

let self = {};

self.login = async function (req, res) {
    try{
        let data = await usuarios.findOne({
            where: { email: email },
            raw: true,
            attributes: ['idUsuario', 'correoElectronico', 'contrasena', 'nombres', 'apellidos']
        });

        if (data === null)
            return res.status(401).send({ message: "Correo electrónico o contraseña incorrectos" });

        const contraeñaValida = await bcrypt.compare(contraseña, data.contrasena);
        if (!contraeñaValida)
            return res.status(401).send({ message: "Correo electrónico o contraseña incorrectos" });

        token = generaToken(data.email, data.nombres);
        return res.status(200).json({
            email: data.email,
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