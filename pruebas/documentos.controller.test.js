const app = require('../index');
const request = require('supertest');
const CodigosRespuesta = require('../utils/codigosRespuesta');
const { generaToken } = require('../services/jwttoken.service');

const TOKEN = generaToken(1, 'melus477@gmail.com', 'Sulem');

describe("GET /api/documentos/clase/:id", function(){

    test("TestObtenerDocumentoDeClase", async () =>{
        const response = await request(app).get("/api/documentos/clase/108").send();
        expect(response.status).toBe(CodigosRespuesta.OK);       
        expect(response.headers['content-type']).toEqual(expect.stringContaining("application/pdf"))
    });

    test("TestObtenerDocumentoDeClaseNoExistente", async () =>{
        const response = await request(app).get("/api/documentos/clase/400000").send();
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);       
    });

    test("TestObtenerDocumentoDeNoPDF", async () =>{
        const response = await request(app).get("/api/documentos/clase/26").send();
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);       
    });
});


describe("POST /api/documentos/clase/", function(){
    
    test("TestSubirDocumentoDeClase", async () =>{
        const response = await request(app).post("/api/documentos/clase").field('idClase', 1).field('nombre', 'DocumentoPrueba')
            .attach('file', `${__dirname}\\documentosprueba\\documento.pdf`);
        
        expect(response.status).toBe(CodigosRespuesta.CREATED);
    });

    test("TestSubirDocumentoDeClaseInexistente", async () =>{
        const response = await request(app).post("/api/documentos/clase").field('idClase', 400000).field('nombre', 'DocumentoPrueba')
            .attach('file', `${__dirname}\\documentosprueba\\documento.pdf`);
        
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);
    });

});

describe("DELETE /api/documentos/clase/:id", function(){

    test("TestEliminarDocumentoDeClase", async () =>{
        const response = await request(app).get("/api/documentos/clase/109").send();
        expect(response.status).toBe(CodigosRespuesta.OK);       
    });

    test("TestEliminarDocumentoNoExistente", async () =>{
        const response = await request(app).get("/api/documentos/clase/400000").send();
        expect(response.status).toBe(CodigosRespuesta.NOT_FOUND);       
    });

    test("TestEliminarDocumentoNoPDF", async () =>{
        const response = await request(app).get("/api/documentos/clase/26").send();
        expect(response.status).toBe(CodigosRespuesta.BAD_REQUEST);       
    });
});