const PDFDocument = require('pdfkit-table');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

async function crearDocumento(res, estadisticas){
  let doc = new PDFDocument({ margin: 35, size: 'A4' });
  doc.pipe(res);

  doc.font('Helvetica-Bold').fontSize(16).text('Reporte del curso', { align: 'center' });
  doc.font('Helvetica').fontSize(20).text(estadisticas.nombre, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(14);
  doc.font('Helvetica-Bold').text('Datos en general del curso', { align: 'left' });
  doc.moveDown(1);
  const calificacion = Number.isNaN(estadisticas.calificacionCurso)? "-" : estadisticas.calificacionCurso;
  const promedio = Number.isNaN(estadisticas.promedioComentarios)? "-" : estadisticas.promedioComentarios;
  doc.font('Helvetica').list(['Calificación del curso: ' + calificacion, 
    'Promedio de comentarios por clase: ' + promedio, 'Estudiantes en el curso: ' + estadisticas.estudiantesInscritos])
  doc.moveDown(1);

  await agregarTabla(doc, estadisticas.clasesTabla);

  if(!Number.isNaN(estadisticas.promedioComentarios)){
    await agregarGraficaBarras(doc, estadisticas.clasesGraficoBarras);
  }

  if(!Number.isNaN(estadisticas.calificacionCurso)){
    await agregarGraficaPastel(doc, estadisticas.calificacionDesglose);
  }

  doc.end();
}

async function agregarTabla(doc, filas){
    const table = {
      title: "Tabla de las clases totales del curso",
      headers: [ "No", "Clase", "Número de comentarios"],
      rows: filas,
    };
  
    await doc.table(table, { 
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(10);
        doc.addBackground(rectRow, '#ffffff', .05);
      },
      columnsSize: [ 20, 400, 80 ]
    });
}

async function agregarGraficaBarras(doc, datos){
  const configuration = {
      type: 'bar',
      data: {
          labels: datos.clases,
          datasets: [{
              label: 'Número de comentarios',
              backgroundColor: 'rgba(217, 217, 217, 0.2)',
              borderColor: 'rgba(71, 71, 71, 1)',
              borderWidth: 1,
              data: datos.comentarios,
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  };

  doc.addPage().font('Helvetica-Bold').text('Gráfica de barras sobre los comentarios de las clases', { align: 'left' });
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  doc.image(imageBuffer, { fit: [500, 500], align: 'center', valign: 'center' });
}

async function agregarGraficaPastel(doc, datos){
  const configPastel = {
    type: 'pie',
    data: {
      labels: datos.calificaciones,
      datasets: [{
        data: datos.totalPorCalificacion,
        backgroundColor: ['rgba(140, 107, 210)', 'rgba(217, 217, 217)', 'rgb(130, 189, 222)', 'rgb(80, 77, 231)', 'rgb(107, 56, 147)', 'rgb(21, 49, 147)', 'rgb(62, 73, 89)', 'rgb(62, 179, 244)','rgb(35, 34, 92)', 'rgb(70, 141, 164)']
      }]
    }
  };

  doc.addPage().font('Helvetica-Bold').text('Gráfica pastel sobre la calificación total del curso', { align: 'left' });
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configPastel);
  doc.image(imageBuffer, { fit: [500, 500], align: 'center', valign: 'center' });
}

module.exports = crearDocumento;