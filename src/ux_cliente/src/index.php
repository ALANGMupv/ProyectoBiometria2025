<?php
// ux/src/index.php
// Archivo principal de la interfaz web. Aunque tiene extensión .php,
// realmente no ejecuta PHP, solo genera HTML.
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Proyecto Biometría – Medidas</title>

    <!-- Hoja de estilos principal -->
    <link rel="stylesheet" href="css/index.css" />

    <!-- Script JS de la app -->
    <script defer src="js/index.js"></script>

</head>
<body>
<header class="topbar">
    <div class="container">
        <h1>Proyecto Biometría - Alan Guevara Martínez</h1>
        <p class="subtitle">Sprint 0 – Medidas en tiempo real</p>
    </div>
</header>

<main class="container">
    <section class="panel">
        <div class="panel-header">
            <h2>Últimas medidas</h2>
            <div class="controls">

                <!-- CÓDIGO PARA CUANDO MUESTRE VARIAS MEDIDAS EN UNA TABLA
                Selector de número de filas a mostrar -->
                <label for="limit">Filas:</label>
                <select id="limit">
                    <option value="1" selected>Última medida</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="300">300</option>
                </select>
            </div>
        </div>

        <div class="table-wrap">
            <!-- Tabla donde se cargan las medidas desde la API -->
            <table class="table" id="tabla-medidas">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>UUID</th>
                    <th>Gas</th>
                    <th>Valor</th>
                    <th>Contador</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                </tr>
                </thead>
                <tbody id="tbody-medidas">
                <!-- Mensaje inicial mientras carga -->
                <tr><td colspan="7" class="muted">Cargando…</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Mensaje de error oculto por defecto -->
        <p id="error" class="error" hidden></p>
    </section>
</main>

<footer class="footer">
    <div class="container">
        <small>© 2025 Proyecto Biometría</small>
    </div>
</footer>
</body>
</html>
