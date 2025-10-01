// .....................................................................
// mainTest3.js Comprueba que la respuesta de la API devuelve lo mismo que se insertó.
// .....................................................................

var request = require("request")
var assert  = require("assert")

// Dirección de servidor REST en Plesk y también en local, veremos si funciona
const IP_PUERTO = process.env.TEST_URL || "https://aguemar.upv.edu.es";

/* Dirección de servidor REST en local 
const IP_PUERTO = "http://localhost:3000"*/

describe("Test 3 : Persistencia de datos", function() {

    it("POST /medida devuelve la misma info que se insertó", function(hecho) {
        var medida = { uuid: "EPSG-GTI-PROY-3A", gas: 11, valor: 999, contador: 42 }

        request.post(
            {
                url: IP_PUERTO + "/medida",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(medida)
            },
            function(err, respuesta, carga) {
                assert.equal(err, null, "¿Error en POST /medida?")
                assert.equal(respuesta.statusCode, 200, "¿No devolvió 200?")

                var solucion = JSON.parse(carga)
                assert.equal(solucion.medida.uuid, "EPSG-GTI-PROY-3A", "¿UUID incorrecto?")
                assert.equal(solucion.medida.gas, 11, "¿Gas incorrecto?")
                assert.equal(solucion.medida.valor, 999, "¿Valor incorrecto?")
                assert.equal(solucion.medida.contador, 42, "¿Contador incorrecto?")

                hecho()
            }
        )
    }) // it

}) // describe
