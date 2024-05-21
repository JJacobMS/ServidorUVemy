const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');


describe("GET /api/clases/:id", function(){
  
  test("TestObtenerClaseExito", async () => {
    const response = await request(app).get("/api/clases/1").send();
    expect(response.status).toBe(CodigosRespuesta.OK);
    expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
    expect(response.body.idClase).toBeDefined();
    expect(response.body.nombre).toBeDefined();
    expect(response.body.descripcion).toBeDefined();
  });

  test("TestObtenerClaseNoExistente", async () => {
    const response = await request(app).get("/api/clases/400000").send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})


describe("POST /api/clases", function(){
  
  test("TestCrearClaseExito", async () => {
    const peticion = { idCurso: 1, nombre: "Clase de prueba", descripcion: "Descripcion de la clase de prueba"};

    const response = await request(app).post("/api/clases").send(peticion);
    expect(response.status).toBe(CodigosRespuesta.CREATED);
    expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
    expect(response.body.idClase).toBeDefined();
    expect(response.body.nombre).toBeDefined();
    expect(response.body.descripcion).toBeDefined();
  });

  test("TestCrearClaseConCursoInexistente", async () => {
    const peticion = { idCurso: 4000000, nombre: "Clase de prueba", descripcion: "Descripcion de la clase de prueba"};

    const response = await request(app).post("/api/clases").send(peticion);
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})

describe("DELETE /api/clases/:id", function(){
  
  test("TestEliminarClaseExito", async () => {
    const response = await request(app).delete("/api/clases/67").send();
    expect(response.status).toBe(CodigosRespuesta.OK);
  });

  test("TestEliminarClaseNoExistente", async () => {
    const response = await request(app).delete("/api/clases/400000").send();
    expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
  });

})
