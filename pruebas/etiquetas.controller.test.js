const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(1, 'admin@gmail.com', 'Sulem');

describe("GET /api/etiquetas", function(){
    test("TestObtenerEtiquetaExito", async () => {
        const response = await request(app).get("/api/etiquetas").set('Authorization', `Bearer ${TOKEN}`).send();
        expect(response.status).toBe(CodigosRespuesta.OK);
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
      });
})
  
describe("POST /api/etiquetas", function(){
  
    test("TestCrearEtiquetaExito", async () => {
      const peticion = { nombre: "NuevaEtiqueta", descripcion: "Nueva etiqueta de prueba"};
  
      const response = await request(app).post("/api/etiquetas").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
      expect(response.status).toBe(CodigosRespuesta.CREATED);
      expect(response.headers['content-type']).toEqual(expect.stringContaining("application/json"))
      expect(response.body.nombre).toBeDefined();
    });
  
    test("TestCrearEtiquetaExistente", async () => {
      const peticion = { nombre: "EtiquetaPrueba", descripcion: "Etiqueta de prueba existente"};
  
      const response = await request(app).post("/api/etiquetas").set('Authorization', `Bearer ${TOKEN}`).send(peticion);
      expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);
    });
  
  })

  describe("DELETE /api/etiquetas/:id", function(){
  
    test("TestEliminarEtiquetaExito", async () => {
      const response = await request(app).delete("/api/etiquetas/40").set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.NO_CONTENT);
    });
  
    test("TestEliminarEtiquetaNoExistente", async () => {
      const response = await request(app).delete("/api/etiquetas/400000").set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });
  
  })