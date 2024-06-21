const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const claimTypes = require('../config/claimtypes');
const { generaToken } = require('../services/jwttoken.service');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { cursos, clases, usuarioscursos, documentos, usuarios } = require('../models');

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

            const usuarioNoAdmin = await usuarios.findByPk(req.tokenDecodificado[claimTypes.Id], { attributes: ['esAdministrador']});
            if(usuarioNoAdmin == null){
                return res.status(CodigosRespuesta.NOT_FOUND).send("El usuario no existe registrado");
            }
            if(usuarioNoAdmin.esAdministrador == 1){
                return res.status(CodigosRespuesta.UNAUTHORIZED).send("No puede realizar esta acción un administrador");
            }

            var minutosRestantes = (tokenDecodificado.exp - (new Date().getTime() / 1000)) / 60;
            if (minutosRestantes < 5) {
                var nuevoToken = generaToken(tokenDecodificado[claimTypes.Id],tokenDecodificado[claimTypes.Email], tokenDecodificado[claimTypes.GivenName]);
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
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ['Token de autorización no válido'] });

            const token = encabezadoAuth.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);

            if (tokenDecodificado[claimTypes.CodigoVerificacion] !== req.body.codigoVerificacion || 
                tokenDecodificado[claimTypes.Email] !== req.body.correoElectronico) {
                return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ['Código de verificación incorrecto'] });
            }

            req.tokenDecodificado = tokenDecodificado;

            next();
        } catch (error) {
            return res.status(CodigosRespuesta.BAD_REQUEST).json({ detalles: ['Error al verificar el token de autorización'] });
        }
    }
}

self.autorizarIdCurso = (roles) =>{
    return async (req, res, next) =>{
        let rolesUsuarioActual = "";
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(idUsuario == null){
            return res.status(CodigosRespuesta.UNAUTHORIZED).send("IdUsuario en token inválido");
        }
        const idCurso = (req.params.idCurso == null) ? req.body.idCurso : req.params.idCurso;

        try{
            const cursoDelProfesor = await cursos.findByPk(idCurso, { attributes: ['idCurso', 'idUsuario']});
            if(cursoDelProfesor == null){
                return res.status(CodigosRespuesta.NOT_FOUND).send("El curso no existe");
            }
            if(cursoDelProfesor.idUsuario == idUsuario){
                rolesUsuarioActual = "Profesor";
            }

            if(await esEstudianteCurso(cursoDelProfesor.idCurso, idUsuario)){
                rolesUsuarioActual = "Estudiante";
            }

            if (roles.split(',').indexOf(rolesUsuarioActual) == -1){
                return res.status(CodigosRespuesta.UNAUTHORIZED).send("No está autorizado para acceder al curso");
            }
                      
            next();

        }catch(error){
            return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send(error);
        }
    }
}

self.autorizarIdClase = (roles) =>{
    return async (req, res, next) =>{
        let rolesUsuarioActual = "";
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(idUsuario == null){
            return res.status(CodigosRespuesta.UNAUTHORIZED).send("IdUsuario en token inválido");
        }
        const idClase = (req.params.idClase == null) ? req.body.idClase : req.params.idClase;

        try{
            const cursoDelProfesor = await obtenerCursoConIdClase(idClase);
            if(cursoDelProfesor == null){
                return res.status(CodigosRespuesta.NOT_FOUND).send("La clase no existe en algún curso");
            }

            if(cursoDelProfesor.idUsuario == idUsuario){
                rolesUsuarioActual = "Profesor";
            }

            if(await esEstudianteCurso(cursoDelProfesor.idCurso, idUsuario)){
                rolesUsuarioActual = "Estudiante";
            }

            if (roles.split(',').indexOf(rolesUsuarioActual) == -1){
                return res.status(CodigosRespuesta.UNAUTHORIZED).send("No está autorizado para acceder a la clase del curso");
            }
                
            next();

        }catch(error){
            return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send(error);
        }
    }
}

self.autorizarIdDocumento = (roles) =>{
    return async (req, res, next) =>{
        let rolesUsuarioActual = "";
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(idUsuario == null){
            return res.status(CodigosRespuesta.UNAUTHORIZED).send("IdUsuario en token inválido");
        }
        const idDocumento = (req.params.idDocumento == null) ? req.body.idDocumento : req.params.idDocumento;

        try{
            const cursoDelProfesor = await obtenerCursoConIdDocumento(idDocumento);
            if(cursoDelProfesor == null){
                return res.status(CodigosRespuesta.NOT_FOUND).send("El documento no existe en alguna clase de un curso");
            }

            if(cursoDelProfesor.idUsuario == idUsuario){
                rolesUsuarioActual = "Profesor";
            }

            if(await esEstudianteCurso(cursoDelProfesor.idCurso, idUsuario)){
                rolesUsuarioActual = "Estudiante";
            }

            if (roles.split(',').indexOf(rolesUsuarioActual) == -1){
                return res.status(CodigosRespuesta.UNAUTHORIZED).send("No está autorizado para acceder a la clase del curso");
            }

            next();

        }catch(error){
            return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send(error);
        }
    }
}

async function obtenerCursoConIdClase(idClase){
    const cursoDelProfesor = await cursos.findOne({ attributes: ['idCurso', 'idUsuario'], 
        include: { model: clases, as: "clases", attributes: ['idClase'], where: { idClase : idClase}}
    });
    return cursoDelProfesor;
}

async function obtenerCursoConIdDocumento(idDocumento){
    const cursoDelProfesor = await cursos.findOne({ attributes: ['idCurso', 'idUsuario'],
        include: { model: clases, as: "clases", attributes: [], 
        include: { model: documentos, as: "documentos", where: {idDocumento: idDocumento}, attributes: []}}, 
    });
    return cursoDelProfesor;
}

async function esEstudianteCurso(idCurso, idUsuario){
    const estudianteClase = await usuarioscursos.findOne({ attributes: ['idUsuario'],
        where: { idCurso: idCurso, idUsuario: idUsuario}});

    return estudianteClase != null;
}

self.esEstudianteCurso = async function (idCurso, idUsuario){
    const estudianteClase = await usuarioscursos.findOne({ attributes: ['idUsuario'],
        where: { idCurso: idCurso, idUsuario: idUsuario}});

    return estudianteClase != null;
}

self.autorizarAdmin = () => {
    return async (req, res, next) => {
        try {
            const encabezadoAuth = req.header('Authorization');
            if (!encabezadoAuth || !encabezadoAuth.startsWith('Bearer ')) {
                return res.status(CodigosRespuesta.UNAUTHORIZED).json();
            }

            const token = encabezadoAuth.split(' ')[1];
            const tokenDecodificado = jwt.verify(token, jwtSecret);

            req.tokenDecodificado = tokenDecodificado;

            const usuarioAdmin = await usuarios.findByPk(req.tokenDecodificado[claimTypes.Id], { attributes: ['esAdministrador'] });
            if (usuarioAdmin == null) {
                return res.status(CodigosRespuesta.NOT_FOUND).send("El usuario no está registrado");
            }
            if (usuarioAdmin.esAdministrador !== 1) {
                return res.status(CodigosRespuesta.UNAUTHORIZED).send("Solo los administradores pueden realizar esta acción");
            }

            const minutosRestantes = (tokenDecodificado.exp - (new Date().getTime() / 1000)) / 60;
            if (minutosRestantes < 5) {
                const nuevoToken = generaToken(tokenDecodificado[claimTypes.Id], tokenDecodificado[claimTypes.Email], tokenDecodificado[claimTypes.GivenName]);
                res.header("Set-Authorization", nuevoToken);
            }
            next();
        } catch (error) {
            return res.status(CodigosRespuesta.UNAUTHORIZED).json();
        }
    }
}


module.exports = self;