const { cursos, usuarioscursos, comentarios, etiquetas, cursosetiquetas, clases, usuarios } = require('../models');
const { Sequelize } = require('sequelize');
const CodigosRespuesta = require('../utils/codigosRespuesta');
let self = {}

self.obtenerEstadisticasCurso = async function(req, res){
    const idCursoSolicitado = req.params.id;
    try{
        let cursoSolicitado = await cursos.findByPk(idCursoSolicitado, {attributes : ['titulo']});
        if(cursoSolicitado == null){
            return res.status(CodigosRespuesta.NOT_FOUND).send("Curso no existe");
        }

        let usuariosDelCurso = await usuarioscursos.findAll({ where: { idCurso: idCursoSolicitado }, attributes: ['idUsuario'] });

        const promedioCalificacion = await usuarioscursos.findOne({
            where: { idCurso: idCursoSolicitado },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('calificacion')), 'promedioCalificacion']]
          });

        const totalComentariosPorClase = await clases.findAll({
            attributes: [
              'idClase', 'nombre',
              [Sequelize.fn('COUNT', Sequelize.col('comentarios.idComentario')), 'cantidadComentarios']
            ],
            include: [{
              model: comentarios,
              attributes: [] 
            }],
            where: { idCurso: idCursoSolicitado },
            group: ['clases.idClase'],
            raw: true 
        });

        /*const resultado = await cursosetiquetas.findAll({
            attributes: [
              'idEtiqueta',
              [Sequelize.col('etiquetas.nombre'), 'nombre']
            ],
            include: [{
              model: etiquetas,
              attributes: [] // No necesitamos más atributos de la tabla Etiqueta, solo 'nombre' que ya se seleccionó arriba
            }, {
              model: usuariosetiquetas,
              attributes: [] // No necesitamos atributos de UsuarioEtiqueta en el resultado final
            }],
            group: ['cursosetiquetas.idEtiqueta', 'etiquetas.nombre'],
            raw: true // Para que el resultado sea un objeto plano
          });*/

        console.log('Promedio de calificaciones:', promedioCalificacion);
        console.log('Comentarios totales: ', totalComentariosPorClase);
        //console.log('Etiquetas asociadas: ', resultado);

        console.log(promedioCalificacion);
        console.log(usuariosDelCurso.length);

        
        return res.status(CodigosRespuesta.OK).send();
    }catch(error){
        console.log(error);
        return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
    }
}

module.exports = self;




