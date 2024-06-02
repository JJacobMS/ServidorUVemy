const app = require('../index');
const fs = require('fs');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');
const TOKEN = generaToken(6, 'enrique@gmail.com', 'Enrico');
const TipoCurso = require('../utils/TipoCurso');


describe("GET /api/cursoslistas/:pagina", function(){
  
    test("TestObtenerCursosListas", async () => {
      const response = await request(app).get("/api/cursoslistas/1").set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.OK);   
      console.log("TestObtenerCursosListas "+JSON.stringify(response.header)+" : "+JSON.stringify(response.body[0].titulo));
      expect(response.body[0].titulo).toBeDefined();
      expect(response.body[0].idCurso).toBeDefined();
      expect(response.body[0].documentos[0].idDocumento).toBeDefined();     
      expect(response.body[0].documentos[0].archivo).toBeDefined(); 
    });
  
    test("TestObtenerCursosListasNoExistente", async () => {
      const response = await request(app).get("/api/cursoslistas/400000").set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });
  
})

describe("GET /api/cursoslistas/:pagina?titulo=tituloejemplo", function(){
  
    test("TestObtenerCursosListasTitulo", async () => {
      const response = await request(app).get("/api/cursoslistas/0").query({ titulo: "Titulo" }) .set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.OK);   
      console.log("TestObtenerCursosListasTitulo "+JSON.stringify(response.header)+" : "+JSON.stringify(response.body[0].titulo));
      response.body.forEach(element => {
        expect(element.titulo).toBeDefined();
        expect(element.titulo).toEqual(expect.stringContaining("Titulo"));
    });
      expect(response.body[0].idCurso).toBeDefined();
      expect(response.body[0].documentos[0].idDocumento).toBeDefined();     
      expect(response.body[0].documentos[0].archivo).toBeDefined(); 
    });
  
    test("TestObtenerCursosListasNoExistenteTitulo", async () => {
      const response = await request(app).get("/api/cursoslistas/400000").query({ titulo: "Titulo" }).set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });
  
})



describe("GET /api/cursoslistas/:pagina?tipoCursos=calificacion=calificacion", function(){
  
    test("TestObtenerCursosListasTipoCursos", async () => {
      const response = await request(app).get("/api/cursoslistas/0").query({ calificacion : 8 }) .set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.OK);   
      console.log("TestObtenerCursosListasTipoCursos "+JSON.stringify(response.header)+" : "+JSON.stringify(response.body[0].titulo));
      expect(response.body[0].titulo).toBeDefined();
      expect(response.body[0].idCurso).toBeDefined();
      expect(response.body[0].documentos[0].idDocumento).toBeDefined();     
      expect(response.body[0].documentos[0].archivo).toBeDefined(); 
    });
  
    test("TestObtenerCursosListasTipoCursosNoExistente", async () => {
      const response = await request(app).get("/api/cursoslistas/400000").query({ calificacion : 8 }).set('Authorization', `Bearer ${TOKEN}`).send();
      expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });
  
})
