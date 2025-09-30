// index.js: carga medidas desde la API y actualiza la tabla

// Base de la API: en local era http://localhost:3000, ahora en Plesk está en /api
// Si cambia la ruta en el servidor, modificar aquí.
window.API_BASE = "https://aguemar.upv.edu.es";

// Referencias a elementos del DOM
const tbody = document.getElementById("tbody-medidas");
const errorBox = document.getElementById("error");
const limitSel = document.getElementById("limit");

// Construye la URL de la API con el límite seleccionado
function construirURL() {
    const limit = encodeURIComponent(limitSel.value || 1);
    return `${window.API_BASE}/medidas?limit=${limit}`;
}

// Carga las medidas desde la API y actualiza la tabla
async function cargarMedidas() {
    try {
        errorBox.hidden = true; // oculta posibles errores previos
        const res = await fetch(construirURL(), { headers: { "Accept": "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        pintarFilas(data.medidas || []); // pinta los datos en la tabla
    } catch (e) {
        console.error(e);
        mostrarError("No se pudieron cargar las medidas. ¿Servidor Node activo?");
        // fallback si no hay datos
        tbody.innerHTML = `<tr><td colspan="7" class="muted">Sin datos</td></tr>`;
    }
}

// Genera las filas de la tabla a partir de los datos
function pintarFilas(filas) {
    if (!filas.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="muted">No hay medidas</td></tr>`;
        return;
    }
    // Se escapan caracteres peligrosos en el UUID (XSS safe)
    tbody.innerHTML = filas.map(r => {
        const [fecha, hora] = formatearFecha(r.fecha);
        return `
        <tr>
          <td>${r.id}</td>
          <td>${escaparHTML(r.uuid)}</td>
          <td>${gasATexto(r.gas)}</td>
          <td>${r.valor}</td>
          <td>${r.contador}</td>
          <td>${fecha}</td>
          <td>${hora}</td>
        </tr>
      `;
    }).join("");
}

// Muestra un mensaje de error
function mostrarError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
}

// Convierte códigos de gas a texto descriptivo
function gasATexto(gas) {
    console.log("Valor recibido en gasATexto:", gas, typeof gas); // log de depuración
    const num = parseInt(gas, 10);
    if (num === 11) return "CO₂";
    if (num === 12) return "Temperatura";
    return gas;
}

// Formatea fecha ISO → [fecha, hora]
function formatearFecha(iso) {
    try {
        let d = new Date(iso);
        if (isNaN(d)) {
            // si no reconoce el formato (ej: "2025-09-30 20:41:03"),
            // lo dividimos manualmente
            const [fecha, hora] = iso.split(" ");
            return [fecha || iso, hora || ""];
        }
        const fecha = d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
        const hora = d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return [fecha, hora];
    } catch {
        return [iso, ""];
    }
}

// Evita inyección de HTML en campos dinámicos
function escaparHTML(s) {
    return String(s).replace(/[&<>"']/g, m => ({
        "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[m]));
}

// Eventos de usuario
limitSel.addEventListener("change", cargarMedidas);

// Auto-refresh cada 5s
setInterval(cargarMedidas, 5000);

// Carga inicial de datos al abrir la página
cargarMedidas();
