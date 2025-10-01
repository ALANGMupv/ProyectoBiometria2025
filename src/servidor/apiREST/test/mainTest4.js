// .....................................................................
// mainTest4.js - Comprueba que GET /medidas devuelve un array de medidas
// .....................................................................

var request = require("request");
var assert  = require("assert");

const IP_PUERTO = process.env.TEST_URL || "https://aguemar.upv.edu.es";

describe("Test 4 : Listado de medidas", function() {

    it("GET /medidas devuelve un array con medidas", function(hecho) {
        request.get(
            {
                url: IP_PUERTO + "/medidas?limit=5",
                headers: { "Content-Type": "application/json" }
            },
            function(err, respuesta, carga) {
                assert.equal(err, null, "¿Error en GET /medidas?");
                assert.equal(respuesta.statusCode, 200, "¿No devolvió 200?");

                var solucion = JSON.parse(carga);

                // Si el backend devuelve { status, medidas }
                const datos = Array.isArray(solucion) ? solucion : solucion.medidas;

                assert.ok(Array.isArray(datos), "¿No devolvió array?");
                assert.ok(datos.length > 0, "¿El array está vacío?");
                hecho();
            }
        );
    });

});
