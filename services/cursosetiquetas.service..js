const db = require('../models/index');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const cursosetiquetas = db.cursosetiquetas;
const cursos = db.cursos;
const etiquetas = db.etiquetas;
const usuarios = db.usuarios;

const crearCursosEtiquetas = async function(idCurso, idEtiqueta, transaccion){
    try{
        let etiquetaRecuperada = await etiquetas.findByPk(idEtiqueta);
        if(etiquetaRecuperada==null){
            return { status: CodigosRespuesta.NOT_FOUND, message: "No se encontró la etiqueta curso" }
        }
        let etiquetaCreada = await cursosetiquetas.create({
            idCurso: idCurso,
            idEtiqueta: idEtiqueta,
        }, { transaction: transaccion })

        if(etiquetaCreada==null){
            return { status: CodigosRespuesta.BAD_REQUEST, message: "Error al crear la etiqueta curso" };;
        }

        return { status: CodigosRespuesta.CREATED, message:etiquetaCreada }
    }catch(error){
        console.log(error);
        return { status: CodigosRespuesta.INTERNAL_SERVER_ERROR, message:error  }
    }
}


const borrarEtiquetasDelCurso = async function(cursoId, transaccion){
    try{
        let id = cursoId;
        let data = await cursos.findByPk(id);
        if(!data){
            return 404
        }
        data = await cursosetiquetas.destroy({ 
            where: { idCurso: id },
            transaction: transaccion 
        });
        if(data >= 1 ){
            return 204
        }else{
            return 404
        }
    }catch(error){
        return { status: 500, message: error.message };
    }
}

module.exports = {crearCursosEtiquetas, borrarEtiquetasDelCurso};