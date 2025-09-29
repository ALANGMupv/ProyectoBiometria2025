/**
 * Logica.js
 * -------------------------
 * Capa de LÓGICA DE NEGOCIO.
 * Aquí se define cómo la aplicación habla con la base de datos SQLite.
 * - Se encarga de abrir la conexión.
 * - Ejecutar consultas SQL.
 * - Devolver resultados a la capa REST (ReglasREST.js).
 */

// Importamos la librería SQLite para Node.js.
// .verbose() sirve para que muestre más mensajes de depuración en consola.
const sqlite3 = require("sqlite3").verbose();

class Logica {
    /**
     * Constructor de la clase Logica.
     * @param {string} nombreBD - ruta al archivo de la base de datos SQLite.
     *
     * Abre la conexión con la BD cuando se crea el objeto.
     */
    constructor(nombreBD) {
        this.nombreBD = nombreBD;                // Guardamos la ruta de la BD
        this.db = new sqlite3.Database(nombreBD); // Abrimos conexión con SQLite
    }

    /**
     * Guardar una medida en la tabla `medidas`.
     * 
     * @param {string} uuid - Identificador único del dispositivo/sensor.
     * @param {number} gas - Tipo de gas medido (ej. CO2, CH4, etc).
     * @param {number} valor - Valor numérico de la medida.
     * @param {number} contador - Número de medida (contador del dispositivo).
     * 
     * @return {Promise<Object>} - Devuelve una promesa que resuelve con la fila insertada.
     */
    guardarMedida(uuid, gas, valor, contador) {
        const self = this; // Guardamos referencia a `this` porque dentro de callbacks cambia.

        return new Promise((resolve, reject) => {
            // SQL para insertar la medida en la tabla
            const sqlInsert = `
                INSERT INTO medidas (uuid, gas, valor, contador)
                VALUES (?, ?, ?, ?)
            `;

            // Ejecutamos el INSERT con los parámetros (evita inyección SQL)
            self.db.run(sqlInsert, [uuid, gas, valor, contador], function (err) {
                if (err) {
                    // Si hay error al insertar → rechazamos la promesa
                    reject(err);
                } else {
                    // `this.lastID` → id de la última fila insertada
                    const id = this.lastID;

                    // Ahora seleccionamos la fila insertada para devolverla completa
                    const sqlSelect = `SELECT * FROM medidas WHERE id = ?`;
                    self.db.get(sqlSelect, [id], (err2, fila) => {
                        if (err2) reject(err2);
                        else resolve(fila); // Devolvemos la fila como objeto
                    });
                }
            });
        });
    }

    /**
     * Listar medidas desde la BD.
     * 
     * @param {number} limit - número máximo de filas a devolver (por defecto 50).
     * @return {Promise<Array>} - Devuelve un array de filas con las medidas.
     */
    listarMedidas(limit = 50) {
        const self = this;
        const lim = Math.max(1, Math.min(parseInt(limit || 50, 10), 500)); // Seguridad: 1–500

        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, uuid, gas, valor, contador, fecha
                  FROM medidas
              ORDER BY datetime(fecha) DESC, id DESC
                 LIMIT ?
            `;
            self.db.all(sql, [lim], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }

}

// Exportamos la clase para usarla en mainServidorREST.js
module.exports = Logica;
