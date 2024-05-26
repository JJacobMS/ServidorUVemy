const bcrypt = require('bcrypt');
const { usuarios, usuariosetiquetas } = require('../models');
const { generaToken, tiempoRestanteToken } = require('../services/jwttoken.service');
const CodigosRespuesta = require('../utils/codigosRespuesta');

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
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Correo electrónico o contraseña incorrectos"] });

        const contraenaValida = await bcrypt.compare(contrasena, data.contrasena);
        if (!contraenaValida)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Correo electrónico o contraseña incorrectos"] });

        const idsEtiqueta = await usuariosetiquetas.findAll({
            where: { idUsuario: data.idUsuario },
            raw: true,
            attributes: ['idEtiqueta']
        }).then(rows => rows.map(row => row.idEtiqueta));;

        token = generaToken(data.idUsuario, data.correoElectronico, data.nombres);
        return res.status(CodigosRespuesta.OK).json({
            idUsuario: data.idUsuario,
            nombres: data.nombres,
            apellidos: data.apellidos,
            correoElectronico: data.correoElectronico,
            idsEtiqueta: idsEtiqueta,
            jwt: token
        });
    } catch (error) {
        res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

self.tiempo = async function (req, res) {
    const tiempo = tiempoRestanteToken(req);
    if (tiempo == null)
        return res.status(CodigosRespuesta.NOT_FOUND).send();
    
    return res.status(CodigosRespuesta.OK).send(tiempo);
}

module.exports = self;