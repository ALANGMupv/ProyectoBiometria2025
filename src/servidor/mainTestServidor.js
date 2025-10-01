// .....................................................................
// mainTestServidor.js - Comprueba que el servidor REST responde
// .....................................................................

var request = require("request");
var assert  = require("assert");

// Dirección de servidor REST (usar siempre https en Plesk)
const IP_PUERTO = process.env.TEST_URL || "https://aguemar.upv.edu.es";

describe("Test del Servidor REST", function() {

    it("GET / responde con 200 (servidor vivo)", function(hecho) {
        request.get(
            { url: IP_PUERTO + "/" },
            function(err, respuesta, cuerpo) {
                assert.equal(err, null, "¿Error en GET /?");
                assert.equal(respuesta.statusCode, 200, "¿No devolvió 200?");
                hecho();
            }
        );
    });

});
