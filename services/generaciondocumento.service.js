const fs = require('fs');
const PDFDocument = require('pdfkit-table');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

async function crearDocumento(){
  let doc = new PDFDocument({ margin: 35, size: 'A4' });

  doc.font('Helvetica-Bold').fontSize(16).text('Reporte del curso', { align: 'center' });
  doc.font('Helvetica').fontSize(20).text('Curso de C# .NET desde cero hasta lo mas avanzado full stack Curso de C# .NET desde cero hasta lo mas avanzado full stack Curso de C# .NET desde cero9', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(14);
  doc.font('Helvetica-Bold').text('Datos en general del curso', { align: 'left' });
  doc.moveDown(1);
  doc.font('Helvetica').list(['Calificación del curso: 10', 'Promedio de comentarios por clase: 20', 'Estudiantes en el curso: 293'])
  doc.moveDown(1);

  await agregarTabla(doc);
  await agregarGraficaBarras(doc);
  await agregarGraficaPastel(doc);

  doc.end();
  
}

async function agregarTabla(doc){
    const table = {
      title: "Tabla de las clases totales del curso",
      headers: [ "No", "Clase", "Número de comentarios"],
      rows: [
        [ "1", "Switzerland", "12%"],
        [ "2","France", "67%"],
        [ "3","England", "33%"],
        [ "4","England", "33%"]
      ],
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

async function agregarGraficaBarras(doc){
  const configuration = {
      type: 'bar',
      data: {
          labels: ['Clase 1', 'Clase 2', 'Clase 3', 'Clase 4', 'Clase 5', 'Clase 6', 'Clase 7'],
          datasets: [{
              label: 'Número de comentarios',
              backgroundColor: 'rgba(217, 217, 217, 0.2)',
              borderColor: 'rgba(71, 71, 71, 1)',
              borderWidth: 1,
              data: [2, 3, 10, 81, 56, 55, 40],
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
  fs.writeFileSync('./chart-image.png', imageBuffer);
  console.log('El gráfico se ha guardado como chart-image.png');
  doc.image('./chart-image.png', { fit: [500, 500], align: 'center', valign: 'center' });

}

async function agregarGraficaPastel(doc){
  const configPastel = {
    type: 'pie',
    data: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [{
        data: [5, 42, 0, 31, 13, 13, 1, 5, 8, 3],
        backgroundColor: ['rgba(140, 107, 210)', 'rgba(217, 217, 217)', 'rgb(130, 189, 222)', 'rgb(80, 77, 231)', 'rgb(107, 56, 147)', 'rgb(21, 49, 147)', 'rgb(62, 73, 89)', 'rgb(62, 179, 244)','rgb(35, 34, 92)', 'rgb(70, 141, 164)']
      }]
    }
  };

  doc.addPage().font('Helvetica-Bold').text('Gráfica pastel sobre la calificación total del curso', { align: 'left' });
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configPastel);
  fs.writeFileSync('./pastel-image.png', imageBuffer);
  console.log('El gráfico se ha guardado como chart-image.png');
  doc.image('./pastel-image.png', { fit: [500, 500], align: 'center', valign: 'center' });

}

module.exports = crearDocumento;