const cursoModel = require('../models/cursos');
const db = require('../models/index');
const cursosetiquetas = require('../services/cursosetiquetas.service.');
const usuarioscursos = require('./usuarioscursos.controller');
const documentos = require('./documentos.controller');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const curso = db.cursos;
const usuario = db.usuarios;
const documentosModel = db.documentos;
const tiposarchivosModel = db.tiposarchivos;
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
        etiquetasRecuperadas = await sequelize.query(
            `SELECT cursosetiquetas.idEtiqueta, etiquetas.nombre
            FROM cursos 
            INNER JOIN cursosetiquetas on cursosetiquetas.idCurso = cursos.idCurso
            INNER JOIN etiquetas on etiquetas.idEtiqueta = cursosetiquetas.idEtiqueta
            WHERE cursos.idCurso= :idCurso`,
            {
              replacements: { idCurso },
              type: sequelize.QueryTypes.SELECT
            }
        )
        if(etiquetasRecuperadas.length > 0){
            cursoRecuperado = cursoRecuperado.toJSON();
            cursoRecuperado.etiquetas = etiquetasRecuperadas
        }
        return res.status(CodigosRespuesta.OK).json(cursoRecuperado)
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.create = async function(req, res){
    let transaccion;
    try{
        if(isNaN(req.body.idUsuario)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al crear el curso, el idUsuario no es valido");
        }
        let usuarioRecuperado = await usuario.findByPk(req.body.idUsuario);
        if(usuarioRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el usuario");
        }

        transaccion = await sequelize.transaction();
        
        let cursoCreado = await curso.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
            idUsuario: req.body.idUsuario
        }, { transaction: transaccion })

        if(cursoCreado==null){
            await transaccion.rollback();
            return res.status(CodigosRespuesta.BAD_REQUEST).send("Error al crear el curso");
        }

        let archivoCreado = await crearArchivoDelCurso(req.file, cursoCreado.idCurso, transaccion);

        if(archivoCreado.status!=201){
            await transaccion.rollback();
            return res.status(CodigosRespuesta.BAD_REQUEST).json("Error al crear el archivo")
        }

        for (let etiquetaId of req.body.etiquetas) {
            if(isNaN(etiquetaId)){
                return res.status(CodigosRespuesta.NOT_FOUND).send("Error al crear una de las etiquetas, el id no es valido");
            }
            let etiquetaCreada = await crearCursosEtiquetas(cursoCreado.idCurso, etiquetaId, transaccion);
            if(etiquetaCreada.status!=201){
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
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.update = async function(req, res){
    let transaccion;
    try{
        if(isNaN(req.params.idCurso) || isNaN(req.body.idCurso)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso, el id no es valido");
        } else if(req.params.idCurso != req.body.idCurso){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso, los id no coinciden");
        }

        let body = {
            id: req.params.idCurso,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            objetivos: req.body.objetivos,
            requisitos: req.body.requisitos,
        };
        let id = req.params.idCurso;

        transaccion = await sequelize.transaction();

        if(isNaN(req.body.idDocumento)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar la miniatura, el idDocumento no es valido");
        }
        
        let resultadoArchivo = await actualizarArchivoDelCurso(req.body.idDocumento, req.file, transaccion);
        if(resultadoArchivo !== 404 && resultadoArchivo !== 204){
            await transaccion.rollback();
            return res.status(resultadoArchivo).json("Error al actualizar la miniatura");
        }

        let data = await curso.update(body, {where: 
            {idCurso:id},
            transaction: transaccion
        });

        if(data[0]==0){
            console.log("Error al actualizar el curso");
            await transaccion.rollback();
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al actualizar el curso");
        } 

        resultadoEtiquetas = await eliminarEtiquetasDelCurso(id, transaccion);

        if(resultadoEtiquetas !== 404 && resultadoEtiquetas !== 204){
            console.log("Error al actualizar el curso");
            await transaccion.rollback();
            return res.status(resultadoEtiquetas).send("Error al actualizar las etiquetas");
        }

        for (let etiquetaId of req.body.etiquetas) {
            if(isNaN(etiquetaId)){
                return res.status(CodigosRespuesta.NOT_FOUND).send("Error al crear una de las etiquetas, el id no es valido");
            }
            let etiquetaCreada = await crearCursosEtiquetas(id, etiquetaId, transaccion);
            if(etiquetaCreada.status!=201){
                await transaccion.rollback();
                return res.status(CodigosRespuesta.BAD_REQUEST).json("Error al crear una de las etiquetas")
            }
        }
        await transaccion.commit();
        return res.status(CodigosRespuesta.NO_CONTENT).send();
    }catch(error){
        if (transaccion && !transaccion.finished) {
            await transaccion.rollback();
        }
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

self.delete = async function(req, res){
    try{
        if(isNaN(req.params.idCurso)){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al eliminar el curso, el id no es valido");
        }

        let id = req.params.idCurso;
        let cursoRecuperado = await curso.findByPk(id);
        if(cursoRecuperado==null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("No se encontró el curso");
        }
        data = await curso.destroy({ where : {idCurso:id}});
        if(data === 1){
            return res.status(CodigosRespuesta.NO_CONTENT).send("Se ha eliminado el curso")
        }else{
            return res.status(CodigosRespuesta.NOT_FOUND).send("Error al eliminar el curso")
        }
    }catch(error){
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).json({ error: error.message });
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