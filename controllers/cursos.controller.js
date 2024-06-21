const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('../services/cursosetiquetas.service.');
const usuarioscursos = require('./usuarioscursos.controller');
const documentos = require('./documentos.controller');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const claimTypes = require('../config/claimtypes');
const {esEstudianteCurso} = require('../middlewares/autorizacion.middleware');
const curso = db.cursos;
const usuario = db.usuarios;
const etiquetasModel = db.etiquetas;
const cursosetiquetasModel = db.cursosetiquetas;
const usuariocurso = db.usuarioscursos;
const sequelize = db.sequelize;
let self = {}

self.getAll = async function (req, res){
    try{
        let data = await curso.findAll({ attributes: ['idCurso', 'titulo', 'descripcion', 'objetivos', 'requisitos', 'idUsuario']})
        return res.status(CodigosRespuesta.OK).json(data)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.get = async function(req, res){
    try{
        if(isNaN(req.params.idCurso)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al recuperar el curso, el id no es valido");
        }
        let idCurso = req.params.idCurso;
        let cursoRecuperado = await curso.findByPk(idCurso, {
            attributes: ['descripcion', 'objetivos', 'requisitos', 'idUsuario']
        });
        if (cursoRecuperado == null) {
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el curso");
        }

        let etiquetasRecuperadas = await cursosetiquetasModel.findAll({
            attributes: [
              ['idEtiqueta', 'idEtiqueta'], 
              [sequelize.col('etiqueta.nombre'), 'nombre']
            ], 
            where: { idCurso: idCurso },
            include: [
              {
                model: etiquetasModel,
                attributes: [],
                }
            ],
        });

        let promedioCalificacion = await usuariocurso.findOne({
            attributes: [
              [sequelize.fn('AVG', sequelize.col('Calificacion')), 'calificacion']
            ],
            where: { idCurso: idCurso }
        });

        let rol;
        let profesor = await usuario.findByPk(cursoRecuperado.idUsuario, {
            attributes: ['nombres','apellidos','correoElectronico'],
            where: {idUsuario: cursoRecuperado.idUsuario}
        });
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        const esEstudiante = await esEstudianteCurso(idCurso, idUsuario);
        if(cursoRecuperado.idUsuario==idUsuario)
        {
            rol = "Profesor";
        } else if(esEstudiante)
        {
            rol = "Estudiante";
        }
        else
        {
            rol = "Usuario";
        }

        cursoRecuperado = cursoRecuperado.toJSON();
        cursoRecuperado.etiquetas = etiquetasRecuperadas;
        cursoRecuperado.calificacion = promedioCalificacion.calificacion;
        cursoRecuperado.rol = rol;
        cursoRecuperado.profesor = profesor.correoElectronico+": "+profesor.nombres +" "+profesor.apellidos;
        

        return res.status(CodigosRespuesta.OK).json(cursoRecuperado)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.create = async function(req, res){
    let transaccion;
    try{
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(isNaN(idUsuario)){
            return res.status(CodigosRespuesta.NOT_FOUND).json("Error al crear el curso, el idUsuario no es valido");
        }
        let usuarioRecuperado = await usuario.findByPk(idUsuario);
        if(usuarioRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).json("No se encontró el usuario");
        }
        transaccion = await sequelize.transaction();
        
        let cursoCreado = await curso.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
            idUsuario: idUsuario
        }, { transaction: transaccion })

        if(cursoCreado==null){
            await transaccion.rollback();
            return res.status(CodigosRespuesta.BAD_REQUEST).json("Error al crear el curso");
        }

        let archivoCreado = await crearArchivoDelCurso(req.file, cursoCreado.idCurso, transaccion);

        if(archivoCreado.status!=CodigosRespuesta.CREATED){
            await transaccion.rollback();
            return res.status(CodigosRespuesta.BAD_REQUEST).json("Error al crear el archivo")
        }

        for (let etiquetaId of req.body.etiquetas) {
            if(isNaN(etiquetaId)){
                await transaccion.rollback();
                return res.status(CodigosRespuesta.NOT_FOUND).json("Error al crear una de las etiquetas, el id no es valido");
            }
            let etiquetaCreada = await crearCursosEtiquetas(cursoCreado.idCurso, etiquetaId, transaccion);
            if(etiquetaCreada.status!=CodigosRespuesta.CREATED){
                await transaccion.rollback();
                return res.status(CodigosRespuesta.BAD_REQUEST).json("Error al crear una de las etiquetas")
            }
        }
        await transaccion.commit();
        return res.status(CodigosRespuesta.CREATED).json(cursoCreado)
    }catch(error){
        if (transaccion && !transaccion.finished) {
            await transaccion.rollback();
        }
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: "Error" });
    }
}

self.update = async function(req, res){
    let transaccion;
    try{
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(isNaN(req.params.idCurso) || isNaN(req.body.idCurso)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso, el id no es valido");
        } else if(req.params.idCurso != req.body.idCurso){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso, los id no coinciden");
        } else if(isNaN(idUsuario)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso, el idUsuario no es valido");
        }

        let idCurso = req.params.idCurso;
        let cursoRecuperado = await curso.findByPk(idCurso, {
            attributes: ['descripcion', 'objetivos', 'requisitos', 'idUsuario']
        });
        if(cursoRecuperado.idUsuario != idUsuario){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso, el idUsuario no es valido");
        }
        let id = idCurso;
        let etiquetas = req.body.etiquetas;
        let body = {
            id: idCurso,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
        };

        transaccion = await sequelize.transaction();

        if(isNaN(req.body.idDocumento)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar la miniatura, el idDocumento no es valido");
        }
        
        let resultadoArchivo = await actualizarArchivoDelCurso(req.body.idDocumento, req.file, transaccion);
        if(resultadoArchivo !== 404 && resultadoArchivo !== 204){
            await transaccion.rollback();
            return res.status(resultadoArchivo).send("Error al actualizar la miniatura");
        }

        let data = await curso.update(body, {where: 
            {idCurso:id},
            transaction: transaccion
        });

        resultadoEtiquetas = await eliminarEtiquetasDelCurso(id, transaccion);

        if(resultadoEtiquetas !== 404 && resultadoEtiquetas !== 204){
            await transaccion.rollback();
            return res.status(resultadoEtiquetas).send("Error al actualizar las etiquetas");
        }
        for (let etiquetaId of etiquetas) {
            if(isNaN(etiquetaId)){
                await transaccion.rollback();
                return res.status(CodigosRespuesta.NOT_FOUND).send("Error al crear una de las etiquetas, el id no es valido");
            }
            let etiquetaCreada = await crearCursosEtiquetas(id, etiquetaId, transaccion);
            if(etiquetaCreada.status!=201){
                await transaccion.rollback();
                return res.status(CodigosRespuesta.BAD_REQUEST).send("Error al crear una de las etiquetas")
            }
        }
        await transaccion.commit();
        return res.status(CodigosRespuesta.NO_CONTENT).send();
    }catch(error){
        if (transaccion && !transaccion.finished) {
            await transaccion.rollback();
        }
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send("Error interno");
    }
}

self.delete = async function(req, res){
    try{
        const idUsuario = req.tokenDecodificado[claimTypes.Id];
        if(isNaN(req.params.idCurso)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al eliminar el curso, el id no es valido");
        }
        let id = req.params.idCurso;
        let cursoRecuperado = await curso.findByPk(id);
        if(cursoRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el curso");
        }
        if(cursoRecuperado.idUsuario != idUsuario){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al eliminar el curso, el idUsuario no es valido");
        }
        data = await curso.destroy({ where : {idCurso:id}});
        return res.status(CodigosRespuesta.NO_CONTENT).send()
        
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json();
    }
}

async function eliminarEtiquetasDelCurso(cursoId, transaccion) {
    const resultado = await cursosetiquetas.borrarEtiquetasDelCurso(cursoId, transaccion);
    return resultado;
}

async function crearArchivoDelCurso(documento, idCurso, transaccion) {
    const resultado = await documentos.crearArchivoDelCurso(documento,idCurso, transaccion);
    return resultado;
}

async function eliminarArchivoDelCurso(documentoId) {
    const resultado = await documentos.borrarArchivoDelCurso(documentoId);
    return resultado;
}

async function actualizarArchivoDelCurso(idDocumento, documento, transaccion) {
    const resultado = await documentos.actualizarArchivoDelCurso(idDocumento, documento, transaccion);
    return resultado;
}


async function crearCursosEtiquetas(idCurso, etiquetaId, transaccion) {
    const resultado = await cursosetiquetas.crearCursosEtiquetas(idCurso, etiquetaId, transaccion);
    return resultado;
}


module.exports = self;