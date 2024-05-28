const bcrypt = require('bcrypt');
const { usuarios, sequelize } = require('../models');
const { generarTokenRegistro } = require('../services/jwttoken.service');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const enviarCorreoVerificacion = require('../services/enviocorreo.service');
const fs = require('fs');
const claimTypes = require('../config/claimtypes');
const { borrarEtiquetasDelUsuario, crearUsuariosEtiquetas } = require('../services/usuariosetiquetas.service');

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
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

self.registrarUsuario = async function (req, res) {
    const transaccion = await sequelize.transaction();
    try {
        const { correoElectronico, contrasena, nombres, apellidos, idsEtiqueta } = req.body;
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        console.log(`Registrando usuario: ${correoElectronico}`);

        const usuario = await usuarios.findOne({
            where: {
                correoElectronico: correoElectronico
            }
        });

        if (usuario) {
            await transaccion.rollback();
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Correo electrónico ya registrado"] });
        }

        const usuarioCreado = await usuarios.create({
            correoElectronico: correoElectronico,
            contrasena: contrasenaHash,
            nombres: nombres,
            apellidos: apellidos
        }, { transaction: transaccion });

        console.log(`Usuario creado: ${usuarioCreado.idUsuario}`);

        for (let etiquetaId of idsEtiqueta) {
            let etiquetaCreada = await crearUsuariosEtiquetas(usuarioCreado.idUsuario, etiquetaId, transaccion);
            if (etiquetaCreada.status !== CodigosRespuesta.CREATED) {
                console.log(`Error al crear etiqueta: ${etiquetaId} - ${etiquetaCreada.message}`);
                await transaccion.rollback();
                return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Error al crear una de las etiquetas"] });
            }
        }

        await transaccion.commit();
        return res.status(CodigosRespuesta.CREATED).json({
            idUsuario: usuarioCreado.idUsuario
        });
    } catch (error) {
        await transaccion.rollback();
        console.log(`Error en registrarUsuario: ${error.message}`);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

self.subirFotoPerfilUsuario = async function (req, res) {
    try {
        const { idUsuario } = req.body;
        const imagen = req.file;
        const tokenDecodificado = req.tokenDecodificado;

        if (idUsuario != tokenDecodificado[claimTypes.Id])
            return res.status(CodigosRespuesta.BAD_REQUEST).send();

        const usuario = await usuarios.findByPk(idUsuario);
        if (!usuario)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Usuario no encontrado"] });

        const imagenBuffer = imagen.buffer;
        usuario.imagen = imagenBuffer;
        console.log(usuario);
        await usuario.save();

        return res.status(CodigosRespuesta.OK).send({ idUsuario: usuario.idUsuario, detalles: ["Foto de perfil actualizada"] });
    } catch (error) {
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

self.obtenerFotoPerfil = async function (req, res) {
    try {
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        const usuario = await usuarios.findByPk(idUsuario, {
            attributes: ['imagen']
        });

        if (!usuario)
            return res.status(CodigosRespuesta.NOT_FOUND).send({ detalles: ["Usuario no encontrado"] });

        if (!usuario.imagen)
            return res.status(CodigosRespuesta.NOT_FOUND).send();

        res.set('Content-Type', 'image/png');
        return res.status(CodigosRespuesta.OK).send(usuario.imagen);
    } catch (error) {
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

self.actualizarPerfilUsuario = async function (req, res) {
    try {
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        const { nombres, apellidos, correoElectronico, contrasena} = req.body;

        if (idUsuario != req.body.idUsuario)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["IdUsuario no coincide con el token"] });

        const usuario = await usuarios.findOne({ where: { idUsuario: idUsuario }, attributes: ['idUsuario', 'correoElectronico']});
        if (!usuario)
            return res.status(CodigosRespuesta.NOT_FOUND).send({ detalles: ["No existe el usuario"] });

        usuario.nombres = nombres;
        usuario.apellidos = apellidos;

        if (correoElectronico != usuario.correoElectronico)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["No se puede cambiar el correo electrónico"] });

        if (contrasena != null){
            const contrasenaHash = await bcrypt.hash(contrasena, 10);
            usuario.contrasena = contrasenaHash;
        }

        await usuario.save();

        return res.status(CodigosRespuesta.NO_CONTENT).send();
    } catch (error) {
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

self.actualizarEtiquetasUsuario = async function (req, res) {
    try {
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        const { idsEtiqueta } = req.body;

        if(idUsuario != req.body.idUsuario)
            return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["IdUsuario no coincide con el token"] });

        const usuario = await usuarios.findOne({ where: { idUsuario: idUsuario }, attributes: ['idUsuario']});
        if (!usuario)
            return res.status(CodigosRespuesta.NOT_FOUND).send({ detalles: ["No existe el usuario"] });

        const transaccion = await sequelize.transaction();
        resultadoEtiquetas = await borrarEtiquetasDelUsuario(idUsuario, transaccion);

        if(resultadoEtiquetas !== CodigosRespuesta.NOT_FOUND && resultadoEtiquetas !== CodigosRespuesta.NO_CONTENT){
            await transaccion.rollback();
            return res.status(resultadoEtiquetas).send({ detalles: ["Error al actualizar las etiquetas"] });
        }

        for (let etiquetaId of idsEtiqueta) {
            let etiquetaCreada = await crearUsuariosEtiquetas(idUsuario, etiquetaId, transaccion);
            if(etiquetaCreada.status != CodigosRespuesta.CREATED){
                await transaccion.rollback();
                return res.status(CodigosRespuesta.BAD_REQUEST).send({ detalles: ["Error al crear una de las etiquetas"] });
            }
        }

        await transaccion.commit();
        return res.status(CodigosRespuesta.NO_CONTENT).send();
    } catch (error) {
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send({ detalles: [error.message] });
    }
}

module.exports = self;