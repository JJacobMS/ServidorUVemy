const { cursos, sequelize } = require('../models');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const crearDocumento = require('../services/generaciondocumento.service');
const generarEstadisticas = require('../services/generacionEstadisticas.service');

let self = {}

self.obtenerEstadisticasCurso = async function(req, res){
    const idCursoSolicitado = req.params.id;
    try{
      let cursoSolicitado = await cursos.findByPk(idCursoSolicitado, {attributes : ['titulo']});
      if(cursoSolicitado == null){
          return res.status(CodigosRespuesta.NOT_FOUND).send("Curso no existe");
      }

      const comentariosTotales = await generarEstadisticas.obtenerComentariosTotales(idCursoSolicitado);
      const calificaciontotal = await generarEstadisticas.obtenerCalificacionTotal(idCursoSolicitado);
      const clasesConComentarios = await generarEstadisticas.obtenerClasesConComentarios(idCursoSolicitado);
      const etiquetasCoinciden = await generarEstadisticas.recuperarEtiquetas(idCursoSolicitado);
      const estudiantesCurso = await generarEstadisticas.recuperarEstudiantesCurso(idCursoSolicitado);
      
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


self.devolverReporte = async function(req, res){
  const idCursoSolicitado = req.params.id;
    try{
      let cursoSolicitado = await cursos.findByPk(idCursoSolicitado, {attributes : ['titulo']});
      if(cursoSolicitado == null){
          return res.status(CodigosRespuesta.NOT_FOUND).send("Curso no existe");
      }

      const comentariosTotales = await generarEstadisticas.obtenerComentariosTotales(idCursoSolicitado);
      const calificaciontotal = await generarEstadisticas.obtenerCalificacionTotal(idCursoSolicitado);
      const clasesConComentarios = await generarEstadisticas.obtenerClasesConComentarios(idCursoSolicitado);
      const calificacionDesglose = await generarEstadisticas.obtenerDesgloseCalificacion(idCursoSolicitado);
      const estudiantesCurso = await generarEstadisticas.recuperarEstudiantesCurso(idCursoSolicitado);

      const clasesTabla = [];
      for(let i = 0; i < clasesConComentarios.length; i++){
        const itemTabla = [];
        itemTabla.push(i + 1);
        itemTabla.push(clasesConComentarios[i].nombre);
        itemTabla.push(clasesConComentarios[i].cantidadComentarios);

        clasesTabla.push(itemTabla);
      }

      const nombresClases = [];
      const comentariosClases = [];
      const limite = (clasesConComentarios.length > 15) ? 15 : clasesConComentarios.length;
      for(let i = 0; i < limite; i++){
        nombresClases.push("Clase " + (i + 1));
        comentariosClases.push(clasesConComentarios[i].cantidadComentarios);
      }
      const clasesGraficoBarras = {clases: nombresClases, comentarios: comentariosClases};
      
      estadisticas = {
        nombre: cursoSolicitado.titulo,
        calificacionCurso: Number.parseFloat(calificaciontotal.dataValues.promedioCalificacion),
        promedioComentarios: comentariosTotales[0].total/clasesConComentarios.length,
        estudiantesInscritos: estudiantesCurso.length,
        clasesTabla: clasesTabla,
        clasesGraficoBarras: clasesGraficoBarras,
        calificacionDesglose: calificacionDesglose
      };
        
      const nombre = "Reporte-Curso-" + idCursoSolicitado + "-" + darFormatoFecha(Date.now());
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=' + nombre + ".pdf");    
      await crearDocumento(res, estadisticas);

    }catch(error){
      console.log(error);
      return res.status(CodigosRespuesta.INTERNAL_SERVER_ERROR).send();
    }
}

function darFormatoFecha(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = self;




