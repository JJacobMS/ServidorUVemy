const bcrypt = require('bcrypt');
const { usuarios, etiquetas } = require('../models');
const { generarTokenRegistro } = require('../services/jwttoken.service');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const enviarCorreoVerificacion = require('../services/enviocorreo.service');
const fs = require('fs');

let self = {};

self.solicitarCodigoVerificacionCorreo = async function (req, res) {
    try {
        const { correoElectronico } = req.body;

        let correoRegistrado = await usuarios.findOne({
            where: { correoElectronico: correoElectronico },
            raw: true,
            attributes: ['correoElectronico']
        });

        if (correoRegistrado === null){
            const codigo = await enviarCorreoVerificacion(correoElectronico);
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
        const { correoElectronico, contrasena, nombres, apellidos, idsEtiqueta } = req.body;
        const imagen = req.file;
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
            apellidos: apellidos
        });

        if (imagen)
            fs.unlink(imagen.path);

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

self.subirFotoPerfilUsuario = async function (req, res) {
    try {
        const { idUsuario } = req.body;
        const imagen = req.file;
        const tokenDecodificado = req.tokenDecodificado;

        if (idUsuario != tokenDecodificado.idUsuario)
            return res.status(CodigosRespuesta.UNAUTHORIZED).send();

        const usuario = await usuarios.findByPk(idUsuario);
        if (!usuario)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Usuario no encontrado"] });

        const imagenBuffer = req.file.buffer;
        usuario.imagen = imagenBuffer;
        console.log(usuario);
        await usuario.save();

        return res.status(CodigosRespuesta.OK).send({ idUsuario: usuario.idUsuario, detalles: ["Foto de perfil actualizada"] });
    } catch (error) {
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: error.message });
    }
}

module.exports = self;