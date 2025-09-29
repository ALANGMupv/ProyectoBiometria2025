package org.jordi.btlealumnos2021;

import android.util.Log;
import org.json.JSONObject;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class LogicaFake {
    private static final String TAG = ">>>>";
    // Aquí irá la URL real de mi endpoint cuando exista (ahora puede ser temporal)
    private static final String API_URL = "http://TU_SERVIDOR/src/servidor/api/medida.php";

    public void guardarMedicion(String uuid, int gas, int valor, int contador) {
        try {
            JSONObject json = new JSONObject();
            json.put("uuid", uuid);
            json.put("gas", gas);         // 11 = CO2 (mandamos numérico), en la lógica ya manejaremos que el 11 es CO2
            json.put("valor", valor);     // ppm
            json.put("contador", contador);

            // Se prepara la conexión HTTP hacia la API
            URL url = new URL(API_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type","application/json; charset=UTF-8"); // Por json
            conn.setDoOutput(true); // habilita escritura en el cuerpo de la petición

            // Se escribe el JSON en el cuerpo de la petición
            try (OutputStream os = conn.getOutputStream()) {
                os.write(json.toString().getBytes("UTF-8"));
            }

            // Se obtiene el código de respuesta del servidor (ej: 200 = OK, 500 = error, etc.)
            int code = conn.getResponseCode();
            Log.d(TAG, "guardarMedicion(): HTTP " + code);

            // Se cierra la conexión
            conn.disconnect();
        } catch (Exception e) {
            // Si algo falla, se captura la excepción y se registra en el log
            Log.e(TAG, "guardarMedicion() error", e);
        }
    }
}
