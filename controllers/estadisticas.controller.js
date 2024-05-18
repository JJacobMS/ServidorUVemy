const { cursos, usuarioscursos, comentarios, etiquetas, cursosetiquetas, usuariosetiquetas, clases, usuarios, sequelize } = require('../models');
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

      const calificaciontotal = await usuarioscursos.findOne({
        where: { idCurso: idCursoSolicitado },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('calificacion')), 'promedioCalificacion']]
      });

      const clasesConComentarios = await clases.findAll({ attributes: [ 'nombre',
            [Sequelize.fn('COUNT', Sequelize.col('comentarios.idComentario')), 'cantidadComentarios']],
          include: [{ model: comentarios, attributes: [] }],
          where: { idCurso: idCursoSolicitado }, group: ['clases.idClase'], raw: true 
      });

      const queryComentariosTotales = `SELECT count(idComentario) AS total FROM comentarios 
        RIGHT JOIN clases ON clases.idClase = comentarios.idClase WHERE clases.idCurso = :idCurso`;

      const [comentariosTotales, metadataComentarios] = await sequelize.query(queryComentariosTotales, {
          replacements: { idCurso: idCursoSolicitado }          
      });
      
      const etiquetasCoinciden = await recuperarEtiquetas(idCursoSolicitado);

      const estudiantesCurso = await recuperarEstudiantesCurso(idCursoSolicitado);
      
      respuestaEstadisticas = {
        nombre: cursoSolicitado.titulo,
        calificacionCurso: Number.parseFloat(calificaciontotal.dataValues.promedioCalificacion),
        promedioComentarios: comentariosTotales[0].total/clasesConComentarios.length,
        estudiantesInscritos: estudiantesCurso.length,
        etiquetasCoinciden: etiquetasCoinciden,
        clases: clasesConComentarios,
        estudiantes: estudiantesCurso
      };
                
      return res.status(CodigosRespuesta.OK).send(respuestaEstadisticas);
    }catch(error){
      console.log(error);
      return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
    }
}

async function recuperarEtiquetas(idCursoSolicitado){
  const queryEtiquetas = `SELECT etiquetas.nombre FROM cursosetiquetas
    INNER JOIN usuariosetiquetas ON usuariosetiquetas.idEtiqueta = cursosetiquetas.idEtiqueta
    INNER JOIN etiquetas ON cursosetiquetas.idEtiqueta = etiquetas.idEtiqueta
    WHERE cursosetiquetas.idCurso = :idCurso GROUP BY cursosetiquetas.idEtiqueta, etiquetas.nombre;
  `;

  const [etiquetasCoinciden, metadata] = await sequelize.query(queryEtiquetas, {
      replacements: { idCurso: idCursoSolicitado }          
  });

  let etiquetasNombres = [];
  for(const item of etiquetasCoinciden){
    etiquetasNombres.push(item.nombre);
  }
  return etiquetasNombres;
}

async function recuperarEstudiantesCurso(idCursoSolicitado){
  const queryEstudiantes = `SELECT concat(nombres, " ", apellidos) AS nombre FROM usuarios
  INNER JOIN usuarioscursos ON usuarioscursos.idUsuario = usuarios.idUsuario WHERE usuarioscursos.idCurso = :idCurso`;

  const [resultsEstudiantes, metadataEs] = await sequelize.query(queryEstudiantes, {
    replacements: { idCurso: idCursoSolicitado }          
  });

  let estudiantesNombres = [];
  for(const item of resultsEstudiantes){
    estudiantesNombres.push(item.nombre);
  }
  return estudiantesNombres;
}

module.exports = self;




