/**
 * Logica.js
 * -------------------------
 * Capa de LÓGICA DE NEGOCIO.
 * Aquí se define cómo la aplicación habla con la base de datos MySQL.
 * - Se encarga de abrir la conexión (pool de conexiones).
 * - Ejecutar consultas SQL.
 * - Devolver resultados a la capa REST (ReglasREST.js).
 */

// Importamos la librería mysql2 con soporte de promesas
const mysql = require("mysql2/promise");

class Logica {
    /**
     * Constructor de la clase Logica.
     * @param {object} config - Objeto con la configuración de conexión a MySQL.
     */
    constructor(config) {
        this.config = config;                 // Guardamos la configuración
        this.pool = mysql.createPool(config); // Creamos el pool de conexiones
    }

    /**
     * Guardar una medida en la tabla `medidas`.
     * 
     * @param {string} uuid - Identificador único del dispositivo/sensor.
     * @param {number} gas - Tipo de gas medido (ej. CO2, CH4, etc).
     * @param {number} valor - Valor numérico de la medida.
     * @param {number} contador - Número de medida (contador del dispositivo).
     * 
     * @return {Promise<Object>} - Devuelve la fila insertada.
     */
    async guardarMedida(uuid, gas, valor, contador) {
        // Conexión desde el pool
        const conn = await this.pool.getConnection();
        try {
            // Insertar medida
            const sqlInsert = `
                INSERT INTO medidas (uuid, gas, valor, contador, fecha)
                VALUES (?, ?, ?, ?, NOW())
            `;
            const [resultado] = await conn.execute(sqlInsert, [uuid, gas, valor, contador]);

            // Recuperar la fila recién insertada (usamos el id autoincremental)
            const sqlSelect = `SELECT * FROM medidas WHERE id = ?`;
            const [filas] = await conn.execute(sqlSelect, [resultado.insertId]);

            return filas[0]; // Devolvemos el objeto con los datos insertados, array de objetos. Es un feedback inmediato para el cliente de la API.
        } finally {
            conn.release(); // Liberamos la conexión al pool
        }
    }

    /**
     * Listar medidas desde la BD.
     * 
     * @param {number} limit - número máximo de filas a devolver (por defecto 50).
     * @return {Promise<Array>} - Devuelve un array de filas con las medidas.
     */
    async listarMedidas(limit = 50) { // Si alguien llama a /api/medidas sin parámetro, el backend responde con 50
        const conn = await this.pool.getConnection();
        try {
            // Seguridad: limit entre 1 y 500 (no le vamos a cumplir el deseo al iluminado que pida 1000 en el front)
            const lim = Math.max(1, Math.min(parseInt(limit || 50, 10), 500));
             console.log("SQL LIMIT calculado =", lim);

            const sql = `
                SELECT id, uuid, gas, valor, contador, fecha
                  FROM medidas
              ORDER BY fecha DESC, id DESC
                 LIMIT ?
            `;
            const [filas] = await conn.execute(sql, [lim]);
            return filas;
        } finally {
            conn.release();
        }
    }
}

// Exportamos la clase para usarla en mainServidorREST.js
module.exports = Logica;
