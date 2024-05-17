const fs = require('fs');
const PDFDocument = require('pdfkit-table');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const backgroundColour = 'white';

let doc = new PDFDocument({ margin: 35, size: 'A4' });

doc.pipe(fs.createWriteStream("./document.pdf"));

doc.font('Helvetica-Bold').fontSize(16).text('Reporte del curso', { align: 'center' });
doc.font('Helvetica').fontSize(20).text('Curso de C# .NET desde cero hasta lo mas avanzado full stack Curso de C# .NET desde cero hasta lo mas avanzado full stack Curso de C# .NET desde cero9', { align: 'center' });
doc.moveDown(1);
doc.fontSize(14);
doc.font('Helvetica-Bold').text('Datos en general del curso', { align: 'left' });
doc.moveDown(1);
doc.font('Helvetica').list(['Calificación del curso: 10', 'Promedio de comentarios por clase: 20', 'Estudiantes en el curso: 293'])
doc.moveDown(1);

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

const configuration = {
    type: 'bar', // Tipo de gráfico
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
        datasets: [{
            label: 'Mi Dataset',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 40],
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

const configPastel = {
    type: 'pie',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: ['red', 'blue', 'yellow'],
        hoverBackgroundColor: ['darkred', 'darkblue', 'darkyellow']
      }]
    }
  };

(async () => {
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync('./chart-image.png', imageBuffer);
    console.log('El gráfico se ha guardado como chart-image.png');
})();

(async () => {
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configPastel);
    fs.writeFileSync('./pastel-image.png', imageBuffer);
    console.log('El gráfico se ha guardado como chart-image.png');
})();


(async function(){
    const table = {
      title: "Tabla de las clases totales del curso",
      headers: [ "Clase", "Número de comentarios"],
      rows: [
        [ "Switzerland", "12%"],
        [ "France", "67%"],
        [ "England", "33%"],
        [ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],[ "England", "33%"],
      ],
    };

    await doc.table(table, { 
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(10);
        doc.addBackground(rectRow, '#ffffff', .05);
      },
      columnsSize: [ 420, 80 ]
    });
  })();

doc.end();
