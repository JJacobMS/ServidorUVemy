const claimTypes = require('../config/claimtypes');
const { cursos, usuarioscursos, usuarios } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');

let self = {};

self.inscribirse = async function(req, res){
    const idUsuario = req.tokenDecodificado[claimTypes.Id];
    const idCurso = req.body.idCurso;

    if(idCurso != req.params.id){
        return res.status(CodigosRespuesta.BAD_REQUEST).send("IdCurso no válido");
    }

    try{
        const cursoExistente = await cursos.findByPk(idCurso, { attributes: [ 'idUsuario']});
        if(cursoExistente == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Curso no existente");
        }

        const usuarioExistente = await usuarios.findByPk(idUsuario, { attributes: [ 'idUsuario']});
        if(usuarioExistente == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Usuario no existente");
        }
    
        if(cursoExistente.idUsuario == idUsuario){
            return res.status(CodigosRespuesta.BAD_REQUEST).send("El profesor no se puede inscribir a su propio curso");
        }
    
        const usuarioEnCurso = await usuarioscursos.findAll({attributes: ['idUsuario'], 
            where: { idCurso: idCurso, idUsuario: idUsuario}});
    
        if(usuarioEnCurso != null && usuarioEnCurso.length > 0){
            return res.status(CodigosRespuesta.BAD_REQUEST).send("Usuario registrado previamente en el curso");
        }
    
        const inscrito = await usuarioscursos.create({
            idCurso: idCurso,
            idUsuario: idUsuario
        });

        res.status(CodigosRespuesta.CREATED).json(inscrito);
    }catch(error){
        console.log(error);
        res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
    }
}

self.calificarCurso = async function(req, res){
    const idUsuario = req.tokenDecodificado[claimTypes.Id];
    const idCurso = req.body.idCurso;

    if(idCurso != req.params.idCurso){
        return res.status(CodigosRespuesta.BAD_REQUEST).send("IdCurso no válido");
    }

    try{
        const usuarioEnCurso = await usuarioscursos.findOne({attributes: ['idUsuarioCurso', 'idCurso', 'idUsuario', 'calificacion'], 
            where: { idCurso: idCurso, idUsuario: idUsuario}});
    
        if(usuarioEnCurso == null){
            return res.status(CodigosRespuesta.BAD_REQUEST).send("El usuario no está inscrito en el curso");
        }

        usuarioEnCurso.calificacion = req.body.calificacion;
        await usuarioEnCurso.save();

        res.status(CodigosRespuesta.CREATED).json(usuarioEnCurso);
    }catch(error){
        console.log(error);
        res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
    }
}

self.obtenerCalificacionUsuarioCurso = async function(req, res){
    const idCurso = req.params.idCurso;
    const idUsuario = req.tokenDecodificado[claimTypes.Id];
    try{
        const cursoExistente = await cursos.findByPk(idCurso, { attributes: [ 'idUsuario']});
        if(cursoExistente == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Curso no existente");
        }

        const usuarioEnCurso = await usuarioscursos.findOne({attributes: ['idUsuario', 'calificacion'], 
            where: { idCurso: idCurso, idUsuario: idUsuario}});
    
        if(usuarioEnCurso == null){
            return res.status(CodigosRespuesta.BAD_REQUEST).send("Usuario no está registrado en el curso");
        }
        return res.status(CodigosRespuesta.OK).json(usuarioEnCurso);
    }catch(error){
        console.log(error);
        res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
    }

    res.status(CodigosRespuesta.OK).send();
}


module.exports = self;