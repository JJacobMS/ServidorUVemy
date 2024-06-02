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

describe("DELETE /api/cursos/:idCurso", function(){
  //INSERT INTO Cursos (idCurso, titulo, descripcion, objetivos, requisitos, idUsuario) values (228,"","","","",6)
  test("TestEliminarCursoExito", async () => {
    const response = await request(app).delete("/api/cursos/228").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
  });

  test("TestEliminarCursoNoExistente", async () => {
    const response = await request(app).delete("/api/cursos/400000").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})


describe("POST /cursos/:idCurso", function(){
  
  test("TestCrearCursoExito", async () => {
    const peticion = {
      titulo: "hola",
      descripcion: "Curso de prueba",
      objetivos: "Curso de prueba",
      requisitos: "Curso de prueba",
      idUsuario: 6,
      etiquetas: [1, 2, 3],
  };
    const response = await request(app)
    .post("/api/cursos")
    .field("titulo", peticion.titulo)
    .field("descripcion", peticion.descripcion)
    .field("objetivos", peticion.objetivos)
    .field("requisitos", peticion.requisitos)
    .field("etiquetas", peticion.etiquetas)
    .field('file', fileBytes, '204.png')
    .set('Authorization', `Bearer ${TOKEN}`);
    console.log("TestCrearCursoExito", JSON.stringify(response.body));
    expect(response.status).toBe(CodigosRespuesta.CREATED);
  });
   
  test("TestCrearCursoErrorRollbackDocumento", async () => {
    const peticion = {
      titulo: "hola",
      descripcion: "Curso de prueba",
      objetivos: "Curso de prueba",
      requisitos: "Curso de prueba",
      idUsuario: 6,
      etiquetas: [1, 2, 3],
  };
    const response = await request(app)
    .post("/api/cursos")
    .field("titulo", peticion.titulo)
    .field("descripcion", peticion.descripcion)
    .field("objetivos", peticion.objetivos)
    .field("requisitos", peticion.requisitos)
    .field("etiquetas", JSON.stringify(peticion.etiquetas))
    .set('Authorization', `Bearer ${TOKEN}`);
    console.log("TestCrearCursoErrorRollbackDocumento "+response.body);
    expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
  });

  test("TestCrearCursoErrorRollbackEtiquetas", async () => {
    const peticion = {
      titulo: "hola",
      descripcion: "Curso de prueba",
      objetivos: "Curso de prueba",
      requisitos: "Curso de prueba",
      idUsuario: 6,
      etiquetas: [1, 2, 33],
  };
    const response = await request(app)
    .post("/api/cursos")
    .field("titulo", peticion.titulo)
    .field("descripcion", peticion.descripcion)
    .field("objetivos", peticion.objetivos)
    .field("requisitos", peticion.requisitos)
    .field("etiquetas", peticion.etiquetas)
    .field('file', fileBytes, '204.png')
    .set('Authorization', `Bearer ${TOKEN}`);
    console.log("TestCrearCursoErrorRollbackEtiquetas", JSON.stringify(response.body));
    expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
  });
})
