// index.js: carga medidas desde la API y actualiza la tabla

// Referencias a elementos del DOM
const tbody = document.getElementById("tbody-medidas");
const errorBox = document.getElementById("error");
const limitSel = document.getElementById("limit");
const btnRefresh = document.getElementById("refresh");

// Construye la URL de la API con el límite seleccionado
function buildURL() {
    const limit = encodeURIComponent(limitSel.value || 50);
    return `${window.API_BASE}/medidas?limit=${limit}`;
}

// Carga las medidas desde la API y actualiza la tabla
async function loadMedidas() {
    try {
        errorBox.hidden = true; // oculta posibles errores previos
        const res = await fetch(buildURL(), { headers: { "Accept": "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderRows(data.medidas || []); // pinta los datos en la tabla
    } catch (e) {
        console.error(e);
        showError("No se pudieron cargar las medidas. ¿Servidor Node activo?");
        // fallback si no hay datos
        tbody.innerHTML = `<tr><td colspan="6" class="muted">Sin datos</td></tr>`;
    }
}

// Genera las filas de la tabla a partir de los datos
function renderRows(rows) {
    if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="muted">No hay medidas</td></tr>`;
        return;
    }
    // Se escapan caracteres peligrosos en el UUID (XSS safe)
    tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${escapeHTML(r.uuid)}</td>
      <td>${gasToText(r.gas)}</td>
      <td>${r.valor}</td>
      <td>${r.contador}</td>
      <td>${r.fecha}</td>
    </tr>
  `).join("");
}

// Muestra un mensaje de error
function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
}

// Convierte códigos de gas a texto descriptivo
function gasToText(gas) {
    if (gas === 11) return "CO₂ (11)";
    if (gas === 12) return "Temperatura (12)";
    return gas;
}

// Evita inyección de HTML en campos dinámicos
function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, m => ({
        "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[m]));
}

// Eventos de usuario
btnRefresh.addEventListener("click", loadMedidas);
limitSel.addEventListener("change", loadMedidas);

// Auto-refresh cada 5s
setInterval(loadMedidas, 5000);

// Carga inicial de datos al abrir la página
loadMedidas();
