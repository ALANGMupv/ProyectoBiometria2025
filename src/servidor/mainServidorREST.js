/**
 * mainServidorREST.js
 * -------------------------
 * Punto de entrada principal para levantar el servidor REST con Express.
 * - Configura Express (servidor - framework de node) y su middleware.
 * - Instancia la lógica de negocio (conexión a la base de datos).
 * - Carga las reglas/endpoints REST definidos.
 * - Arranca el servidor escuchando en el puerto configurado.
 */

// Importamos las librerías y módulos necesarios
const express = require("express");           // Framework para levantar el servidor HTTP y definir rutas
const cors = require("cors"); // El navegador ve que apache está en puerto 80 y mi API en 3000, lo bloquea, necesito "esto"

const Logica = require("./logica/Logica");   // Módulo que implementa la lógica de negocio y acceso a la base de datos
const reglasREST = require("./apiREST/ReglasREST"); // Módulo con las reglas/rutas REST que usará el servidor

// Definición de constantes de configuración
const PORT = 3000;                             // Puerto donde escuchará el servidor
const BD_PATH = "./bd/proyecto_biometria.db";  // Ruta al archivo de la base de datos SQLite

// Crear la aplicación de Express
const app = express();

// Middleware para que Express pueda interpretar cuerpos de peticiones en formato JSON
// Ej: POST con body {"usuario":"pepe"}
app.use(express.json());
// permitir a cualquier origen (para desarrollo está bien). LUEGO YA VEREMOS.
app.use(cors());

// Instanciamos la lógica de negocio, pasándole la ruta de la BD.
// Esto internamente abrirá/gestionará la conexión a la base de datos.
const logica = new Logica(BD_PATH);

// Cargamos las rutas REST y las "montamos" sobre la aplicación Express.
// Le pasamos la instancia de lógica para que las rutas puedan acceder a la BD.
app.use("/", reglasREST(logica));

// Finalmente, arrancamos el servidor y lo ponemos a escuchar en el puerto definido.
// Al estar levantado, aceptará peticiones en http://localhost:3000
app.listen(PORT, () => {
    console.log(`Servidor REST escuchando en http://localhost:${PORT}`);
});
