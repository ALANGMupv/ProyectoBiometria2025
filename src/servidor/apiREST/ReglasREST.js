/**
 * ReglasREST.js
 * -------------------------
 * Define los endpoints REST de la API.
 * Importante: aquí NO se hacen consultas SQL directamente.
 * Este archivo solo:
 *   - Recibe peticiones HTTP (POST, GET, etc.).
 *   - Valida datos de entrada.
 *   - Llama a la capa de lógica (Logica.js), que es la que realmente accede a la BD.
 */

// @author: Alan Guevara Martínez

const express = require("express");

/**
 * Función que crea un router de Express con las reglas REST definidas.
 * Recibe como parámetro `logica`, que es la instancia de la capa de negocio
 * (conexión a la base de datos y funciones para operar con ella).
 */

// logica: Logica → reglasREST() → router : Router
function reglasREST(logica) {
    // Creamos un "router", un mini-servidor de Express donde definiremos las rutas
    const router = express.Router();

    /**
     * Endpoint: POST /medida
     * -------------------------
     * Espera un JSON en el body con esta estructura:
     *   { uuid, gas, valor, contador }
     *
     * - uuid: identificador único del dispositivo/sensor.
     * - gas: tipo de gas que mide el sensor.
     * - valor: valor numérico de la medida.
     * - contador: número de medida (para llevar el orden).
     *
     * Respuesta:
     *   - Si falta algún campo → error 400 (bad request).
     *   - Si todo va bien → status: "ok" + la medida guardada en la BD.
     */
    router.post("/medida", async (req, res) => {
        try {
            // Extraemos los datos que nos han eviado en el body JSON
            const { uuid, gas, valor, contador } = req.body;

            // Validación: comprobamos que vengan todos los campos
            if (!uuid || gas === undefined || valor === undefined || contador === undefined) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Faltan campos en el JSON, ¿Qué ha pasado ahora?"
                });
            }

            // Llamamos a la lógica de negocio para guardar la medida en la BD
            const medidaInsertada = await logica.guardarMedida(uuid, gas, valor, contador);

            // Respondemos al cliente confirmando el guardado
            res.json({
                status: "ok",
                medida: medidaInsertada
            });
        } catch (err) {
            // Si ocurre un error inesperado, lo logueamos y devolvemos error 500
            console.error("Error en POST /medida:", err);
            res.status(500).json({
                status: "error",
                mensaje: "Error interno",
                detalle: err.message   // devuelve también el detalle
            });
        }
    });

    /**
     * Endpoint: GET /medidas
     * -------------------------
     * Devuelve las últimas medidas guardadas en la BD.
     * Ejemplo: GET /medidas?limit=20
     */
    router.get("/medidas", async (req, res) => {
        try {
            const { limit } = req.query; // recogemos el query param ?limit=...
            console.log("GET /medidas con limit =", limit); //
            const filas = await logica.listarMedidas(limit);

            res.json({
                status: "ok",
                medidas: filas
            });
        } catch (err) {
            console.error("Error en GET /medidas:", err);
            res.status(500).json({
                status: "error",
                mensaje: "Error interno"
            });
        }
    });

    // Devolvemos el router con todas las rutas definidas (en este caso solo /medida)
    return router;
}

// Exportamos la función para que mainServidorREST.js pueda usarla
module.exports = reglasREST;
