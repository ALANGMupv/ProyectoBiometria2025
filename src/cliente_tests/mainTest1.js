// .....................................................................
// mainTest1.js Comprueba que POST /medida guarda una medida correctamente.
// .....................................................................

var request = require("request")
var assert  = require("assert")

// Dirección de servidor REST
const IP_PUERTO = "http://localhost:3000"

// .....................................................................
// grupo de tests
// .....................................................................
describe("Test 1 : Inserción de medidas", function() {

    // .........................................................
    it("POST /medida inserta correctamente", function(hecho) {
        var medida = { uuid: "EPSG-GTI-PROY-3A", gas: 11, valor: 1234, contador: 7 }

        request.post(
            {
                url: IP_PUERTO + "/medida",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(medida)
            },
            function(err, respuesta, carga) {
                assert.equal(err, null, "¿Error en POST /medida?")
                assert.equal(respuesta.statusCode, 200, "¿El código no es 200?")

                var solucion = JSON.parse(carga)
                assert.equal(solucion.status, "ok", "¿No se devolvió status=ok?")
                assert.equal(solucion.medida.valor, 1234, "¿El valor no es el esperado?")

                hecho()
            }
        )
    }) // it

}) // describe
