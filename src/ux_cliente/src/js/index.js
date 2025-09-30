// index.js: carga medidas desde la API y actualiza la tabla

// Base de la API: en local era http://localhost:3000, ahora en Plesk está en /api
// Si cambia la ruta en el servidor, modificar aquí.
window.API_BASE = "https://aguemar.upv.edu.es";

// Referencias a elementos del DOM
const tbody = document.getElementById("tbody-medidas");
const errorBox = document.getElementById("error");
const limitSel = document.getElementById("limit");
const btnRefresh = document.getElementById("refresh");

/* CÓDIGO PARA CUANDO MUESTRE VARIAS MEDIDAS EN UNA TABLA (SI ES QUE LO HAGO ASÍ)
// Construye la URL de la API con el límite seleccionado
function construirURL() {
    const limit = encodeURIComponent(limitSel.value || 50);
    return `${window.API_BASE}/medidas?limit=${limit}`;
}*/

function construirURL() {
    // Ahora solo pedimos la última medida → limit=1
    return `${window.API_BASE}/medidas?limit=1`;
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
        tbody.innerHTML = `<tr><td colspan="6" class="muted">Sin datos</td></tr>`;
    }
}

// Genera las filas de la tabla a partir de los datos
function pintarFilas(filas) {
    if (!filas.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="muted">No hay medidas</td></tr>`;
        return;
    }
    /* CÓDIGO PARA CUANDO MUESTRE VARIAS MEDIDAS EN UNA TABLA (SI ES QUE LO HAGO ASÍ)
    // Se escapan caracteres peligrosos en el UUID (XSS safe)
    tbody.innerHTML = filas.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${escaparHTML(r.uuid)}</td>
      <td>${gasATexto(r.gas)}</td>
      <td>${r.valor}</td>
      <td>${r.contador}</td>
      <td>${r.fecha}</td>
    </tr>
  `).join("");
     */

    const r = filas[0]; // solo la primera
    tbody.innerHTML = `
    <tr>
      <td>${r.id}</td>
      <td>${escaparHTML(r.uuid)}</td>
      <td>${gasATexto(r.gas)}</td>
      <td>${r.valor}</td>
      <td>${r.contador}</td>
      <td>${r.fecha}</td>
    </tr>
  `;
}

// Muestra un mensaje de error
function mostrarError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
}

// Convierte códigos de gas a texto descriptivo
function gasATexto(gas) {
    if (gas === 11) return "CO₂ (11)";
    if (gas === 12) return "Temperatura (12)";
    return gas;
}

// Evita inyección de HTML en campos dinámicos
function escaparHTML(s) {
    return String(s).replace(/[&<>"']/g, m => ({
        "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[m]));
}

// Eventos de usuario
btnRefresh.addEventListener("click", cargarMedidas);
limitSel.addEventListener("change", cargarMedidas);

// Auto-refresh cada 5s
setInterval(cargarMedidas, 5000);

// Carga inicial de datos al abrir la página
cargarMedidas();
