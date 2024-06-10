const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(2, 'jacob@gmail.com', 'Jacob');

describe("GET /api/clases/:id", function(){
  
  test("TestObtenerClaseExito", async () => {
    const response = await request(app).get("/api/clases/1").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.OK);
    expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
    expect(response.body.idClase).toBeDefined();
    expect(response.body.nombre).toBeDefined();
    expect(response.body.descripcion).toBeDefined();
  });

  test("TestObtenerClaseNoExistente", async () => {
    const response = await request(app).get("/api/clases/400000").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})


describe("POST /api/clases", function(){
  
  test("TestCrearClaseExito", async () => {
    const peticion = { idCurso: 1, nombre: "Clase de prueba", descripcion: "Descripcion de la clase de prueba"};

    const response = await request(app).post("/api/clases").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
    expect(response.status).toBe(CodigosRespuesta.CREATED);
    expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
    expect(response.body.idClase).toBeDefined();
    expect(response.body.nombre).toBeDefined();
    expect(response.body.descripcion).toBeDefined();
  });

  test("TestCrearClaseConCursoInexistente", async () => {
    const peticion = { idCurso: 4000000, nombre: "Clase de prueba", descripcion: "Descripcion de la clase de prueba"};

    const response = await request(app).post("/api/clases").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})

describe("DELETE /api/clases/:id", function(){
  
  test("TestEliminarClaseExito", async () => {
    const response = await request(app).delete("/api/clases/3").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.OK);
  });

  test("TestEliminarClaseNoExistente", async () => {
    const response = await request(app).delete("/api/clases/400000").set('Authorization', `Bearer ${TOKEN}`).send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})
