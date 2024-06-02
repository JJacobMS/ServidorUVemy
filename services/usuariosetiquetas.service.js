const { usuarios, etiquetas, usuariosetiquetas} = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');

const crearUsuariosEtiquetas = async function(idUsuario, idEtiqueta, transaccion){
    try{
        let etiquetaRecuperada = await etiquetas.findByPk(idEtiqueta);
        if(etiquetaRecuperada==null){
            return { status: CodigosRespuesta.NOT_FOUND, message: "No se encontró la etiqueta" }
        }
        let etiquetaCreada = await usuariosetiquetas.create({
            idUsuario: idUsuario,
            idEtiqueta: idEtiqueta,
        }, { transaction: transaccion })

        if(etiquetaCreada==null){
            return { status: CodigosRespuesta.BAD_REQUEST, message: "Error al crear la relación entre usuario y etiqueta" };;
        }

        return { status: CodigosRespuesta.CREATED, message:etiquetaCreada }
    }catch(error){
        console.log(error);
        return { status: CodigosRespuesta.INTERNAL_SERVER_ERROR, message:error  }
    }
}


const borrarEtiquetasDelUsuario = async function(idUsuario, transaccion){
    try{
        let id = idUsuario;
        let data = await usuarios.findByPk(id);
        if(!data){
            return 404
        }
        data = await usuariosetiquetas.destroy({ 
            where: { idUsuario: id },
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

module.exports = {crearUsuariosEtiquetas, borrarEtiquetasDelUsuario};