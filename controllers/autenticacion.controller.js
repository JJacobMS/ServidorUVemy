const bcrypt = require('bcrypt');
const { usuarios, etiquetas, Sequelize } = require('../models');
const { generaToken, tiempoRestanteToken, generarTokenRegistro } = require('../services/jwttoken.service');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const enviarCorreoVerificacion = require('../services/enviocorreo.service');

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
            return res.status(CodigosRespuesta.UNAUTHORIZED).send({ detalles: ["Correo electrónico o contraseña incorrectos"] });

        const contraenaValida = await bcrypt.compare(contrasena, data.contrasena);
        if (!contraenaValida)
            return res.status(CodigosRespuesta.UNAUTHORIZED).send({ detalles: ["Correo electrónico o contraseña incorrectos"] });

        token = generaToken(data.idUsuario, data.correoElectronico, data.nombres);
        return res.status(CodigosRespuesta.OK).json({
            idUsuario: data.idUsuario,
            nombres: data.nombres,
            apellidos: data.apellidos,
            correoElectronico: data.correoElectronico,
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

self.solicitarCodigoVerificacionCorreo = async function (req, res) {
    try {
        const { correoElectronico } = req.body;

        let correoRegistrado = await usuarios.findOne({
            where: { correoElectronico: correoElectronico },
            raw: true,
            attributes: ['correoElectronico']
        });

        if (correoRegistrado === null){
            const codigo = enviarCorreoVerificacion(correoElectronico);
            token = generarTokenRegistro(correoElectronico, codigo);
            return res.status(CodigosRespuesta.OK).send({ jwt: token });
        } else {
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Correo electrónico ya registrado"] });
        }
    } catch (error) {
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: error.message });
    }
}

self.registrarUsuario = async function (req, res) {
    try {
        const { correoElectronico, contrasena, nombres, apellidos, idsEtiqueta, imagen } = req.body;
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        const usuario = await usuarios.findOne({
            where: {
                correoElectronico: correoElectronico
            }
        });

        if (usuario)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Correo electrónico ya registrado" ]});

        await usuarios.create({
            correoElectronico: correoElectronico,
            contrasena: contrasenaHash,
            nombres: nombres,
            apellidos: apellidos,
            imagen: imagen ? imagen : null
        });

        const usuarioCreado = await usuarios.findOne({
            where: {
                correoElectronico: correoElectronico
            }
        });

        if (idsEtiqueta && idsEtiqueta.length > 0) {
            await Promise.all(idsEtiqueta.map(async etiquetaId => {
                const etiqueta = await etiquetas.findByPk(etiquetaId);
                if (etiqueta)
                    await usuarioCreado.addEtiqueta(etiqueta);
            }))
        }

        return res.status(CodigosRespuesta.CREATED).json({
            idUsuario: usuarioCreado.idUsuario
        });
    } catch (error) {
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: error.message });
    }
}

module.exports = self;