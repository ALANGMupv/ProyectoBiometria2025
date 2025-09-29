/**
 * crearBD.js
 * -------------------------
 * Script para inicializar la base de datos SQLite en un archivo local.
 * Crea la tabla `medidas` si no existe.
 */

const sqlite3 = require("sqlite3").verbose();

// Creamos/abrimos el archivo de BD en la carpeta bd/
const db = new sqlite3.Database("./bd/proyecto_biometria.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS medidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    gas INTEGER NOT NULL,
    valor INTEGER NOT NULL,
    contador INTEGER NOT NULL,
    fecha TEXT DEFAULT (datetime('now'))
  )`);
});

db.close();

console.log("Base de datos inicializada en ./bd/proyecto.db");
