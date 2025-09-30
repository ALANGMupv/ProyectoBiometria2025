/**
 * mainServidorREST.js
 * -------------------------
 * Punto de entrada principal para levantar el servidor REST con Express.
 * - Configura Express (servidor - framework de node) y su middleware.
 * - Instancia la lógica de negocio (conexión a la base de datos MySQL en Plesk).
 * - Carga las reglas/endpoints REST definidos.
 * - Arranca el servidor escuchando en el puerto configurado.
 */

// Importamos las librerías y módulos necesarios
const express = require("express");           // Framework para levantar el servidor HTTP y definir rutas
const cors = require("cors");                 // Middleware para permitir peticiones desde otros orígenes

const Logica = require("./logica/Logica");    // Capa de lógica de negocio (conexión a MySQL)
const reglasREST = require("./apiREST/ReglasREST"); // Endpoints REST

// Puerto donde escuchará el servidor (en Plesk se define automáticamente, usamos el que da el sistema)
const PORT = process.env.PORT || 3000;

// Configuración de conexión a MySQL (Plesk)
const DB_CONFIG = {
    host: "localhost:3306",                 
    user: "alan",                      
    password: "12345pleskGuevara",     
    database: "aguemar_proyecto_biometria" 
};

// Crear la aplicación de Express
const app = express();

// Middleware para procesar JSON en las peticiones
app.use(express.json());
app.use(cors()); // Permitir peticiones desde cualquier origen (útil para la web en /httpdocs)

// Instanciamos la lógica de negocio con la configuración de MySQL
const logica = new Logica(DB_CONFIG);

// Montamos las rutas REST con acceso a la lógica
app.use("/", reglasREST(logica));

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor REST escuchando en http://localhost:${PORT}`);
});
