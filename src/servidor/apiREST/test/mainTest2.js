// .....................................................................
// @author: Alan Guevara Martínez
// mainTest2.js Comprueba que si falta un campo, la API devuelve 400 error.
// .....................................................................

var request = require("request")
var assert  = require("assert")

// Dirección de servidor REST en Plesk y también en local, veremos si funciona
const IP_PUERTO = process.env.TEST_URL || "https://aguemar.upv.edu.es";

/* Dirección de servidor REST en local 
const IP_PUERTO = "http://localhost:3000"*/

describe("Test 2 : Validación de JSON", function() {

    it("POST /medida con JSON incompleto devuelve error 400", function(hecho) {
        var medidaIncompleta = { uuid: "EPSG-GTI-PROY-3A", gas: 11 } // faltan campos

        request.post(
            {
                url: IP_PUERTO + "/medida",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(medidaIncompleta)
            },
            function(err, respuesta, carga) {
                assert.equal(err, null, "¿Error en POST /medida?")
                assert.equal(respuesta.statusCode, 400, "¿No devolvió 400?")

                var solucion = JSON.parse(carga)
                assert.equal(solucion.status, "error", "¿Status no es error?")
                hecho()
            }
        )
    }) // it

}) // describe
