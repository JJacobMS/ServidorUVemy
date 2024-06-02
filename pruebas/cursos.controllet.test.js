const app = require('../index');
const fs = require('fs');
const fileBytes = fs.readFileSync(`${__dirname}\\documentosprueba\\204.png`);
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');
const TOKEN = generaToken(6, 'enrique@gmail.com', 'Enrico');

describe("GET /api/cursos/:idCurso", function(){
  
  test("TestObtenerCursoDetallesExito", async () => {
    const response = await request(app).get("/api/cursos/213").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.OK);
    expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
    expect(response.body.descripcion).toBeDefined();
    expect(response.body.objetivos).toBeDefined();
    expect(response.body.requisitos).toBeDefined();
    expect(response.body.idUsuario).toBeDefined();
    expect(response.body.etiquetas).toBeDefined();
    expect(response.body.calificacion).toBeDefined();
    expect(response.body.rol).toBeDefined();
    expect(response.body.profesor).toBeDefined();
  });

  test("TestObtenerCursoDetallesNoExistente", async () => {
    const response = await request(app).get("/api/cursos/400000").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})

describe("GET /api/cursos/:idCurso", function(){
  //INSERT INTO Cursos (idCurso, titulo, descripcion, objetivos, requisitos, idUsuario) values (228,"","","","",6)
  test("TestObtenerEliminarCursoExito", async () => {
    const response = await request(app).delete("/api/cursos/228").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
  });

  test("TestObtenerEliminarCursoNoExistente", async () => {
    const response = await request(app).delete("/api/cursos/400000").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})


describe("POST /cursos/:idCurso", function(){
  
  test("TestModificarCursoExito", async () => {
    const peticion = {
      idCurso: 223,
      titulo: "hola",
      descripcion: "Curso de prueba",
      objetivos: "Curso de prueba",
      requisitos: "Curso de prueba",
      idUsuario: 6,
      etiquetas: [1, 2, 3],
      idDocumento: 110,
  };
    const response = await request(app)
    .put("/api/cursos/223")
    .field("idCurso", peticion.idCurso)
    .field("titulo", peticion.titulo)
    .field("descripcion", peticion.descripcion)
    .field("objetivos", peticion.objetivos)
    .field("requisitos", peticion.requisitos)
    .field("idUsuario", peticion.idUsuario)
    .field("etiquetas", JSON.stringify(peticion.etiquetas))
    .field("idDocumento", peticion.idDocumento)
    .field('file', fileBytes, '204.png')
    .set('Authorization', `Bearer ${TOKEN}`);

  console.log(response);
    expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
  });

  test("TestModificarCursoNoExistente", async () => {
    const peticion = {
      idCurso: 400000,
      titulo: "hola",
      descripcion: "Curso de prueba",
      objetivos: "Curso de prueba",
      requisitos: "Curso de prueba",
      idUsuario: 6,
      etiquetas: [1, 2, 3],
      idDocumento: 112,
      file: [1, 2, 3]
  };

    const response = await request(app).put("/api/cursos/400000").send(peticion).set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})