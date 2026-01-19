// TAREA 1: Conectar con Internet y bajar los datos
async function obtenerDatosMeteo(latitude, longitude) {
  try {
    // Definimos la dirección base (la ventanilla de la API)
    const baseUrl = "https://api.open-meteo.com/v1/forecast";

    // Configuramos los parámetros (qué datos queremos pedir)
    // Usamos URLSearchParams para que sea más limpio y evitar errores
    const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
      timezone: "auto"
    });

    // Unimos todo para crear la URL completa
    const url = `${baseUrl}?${params.toString()}`;

    // Hacemos la petición (fetch) y esperamos la respuesta (await)
    const response = await fetch(url);

    // Si la respuesta no es OK (ej: error 404), lanzamos un error
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    // Si todo va bien, convertimos la respuesta a JSON
    return await response.json();
    
  } catch (error) {
    throw new Error(`Fallo al obtener datos: ${error.message}`);
  }
}

// TAREA 2: Traducir códigos numéricos a Emojis del Clima
function interpretarCodigoTiempo(codigo) {
  const mapaCodigos = {
    0: { descripcion: "Despejado", emoji: "☀️" },
    1: { descripcion: "Principalmente despejado", emoji: "🌤️" },
    2: { descripcion: "Parcialmente nublado", emoji: "⛅" },
    3: { descripcion: "Nublado", emoji: "☁️" },
    45: { descripcion: "Niebla", emoji: "🌫️" },
    48: { descripcion: "Niebla con escarcha", emoji: "🌫️" },
    51: { descripcion: "Llovizna ligera", emoji: "🌦️" },
    53: { descripcion: "Llovizna moderada", emoji: "🌦️" },
    55: { descripcion: "Llovizna densa", emoji: "🌦️" },
    61: { descripcion: "Lluvia leve", emoji: "🌧️" },
    63: { descripcion: "Lluvia moderada", emoji: "🌧️" },
    65: { descripcion: "Lluvia fuerte", emoji: "🌧️" },
    71: { descripcion: "Nieve ligera", emoji: "❄️" },
    73: { descripcion: "Nieve moderada", emoji: "❄️" },
    75: { descripcion: "Nieve fuerte", emoji: "❄️" },
    80: { descripcion: "Chubascos leves", emoji: "🌧️" },
    81: { descripcion: "Chubascos moderados", emoji: "🌧️" },
    82: { descripcion: "Chubascos violentos", emoji: "🌧️" },
    95: { descripcion: "Tormenta", emoji: "⛈️" },
    96: { descripcion: "Tormenta con granizo", emoji: "⛈️" },
    99: { descripcion: "Tormenta fuerte", emoji: "⛈️" }
  };

  // Si el código no existe, devolvemos "Desconocido"
  return mapaCodigos[codigo] || { descripcion: "Desconocido", emoji: "❓" };
}

// TAREA 3: Traducir grados a Dirección del Viento
// A) Esta es la función que os dio el profesor
function degreesToCompass(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// B) Esta es la función que pide el enunciado (usa la del profesor dentro)
function interpretarDireccionViento(grados) {
  // 1. Obtenemos la letra (N, S, E...) usando la lógica del profe
  const direccionTxt = degreesToCompass(grados);

  // 2. Le asignamos una flechita
  const flechas = {
    "N": "⬆️",
    "NE": "↗️",
    "E": "➡️",
    "SE": "↘️",
    "S": "⬇️",
    "SW": "↙️",
    "W": "⬅️",
    "NW": "↖️"
  };

  // 3. Devolvemos el objeto completo
  return {
    direccion: direccionTxt,
    emoji: flechas[direccionTxt]
  };
}


// TAREA 4: Crear la "Caja Bonita" para mostrar por pantalla

function formatearDatosMeteo(datos, latitude, longitude) {
  const cur = datos.current;
  const units = datos.current_units;
  
  // Usamos las funciones de ayuda que creamos arriba
  const clima = interpretarCodigoTiempo(cur.weather_code);
  const viento = interpretarDireccionViento(cur.wind_direction_10m);
  const fecha = new Date().toLocaleString();

  // Creamos el dibujo con Template String (las comillas invertidas ` `)
  return `
╔══════════════════════════════════════════╗
║     🌍 PRONÓSTICO DEL TIEMPO             ║
╚══════════════════════════════════════════╝

📍 Ubicación: ${latitude}°N, ${longitude}°W
🕐 Fecha: ${fecha}

╭─────────────────────────────────────────╮
│ 🌡️  TEMPERATURA                         │
├─────────────────────────────────────────┤
│ Actual:         ${cur.temperature_2m} ${units.temperature_2m}                  │
│ Sensación:      ${cur.apparent_temperature} ${units.apparent_temperature}                  │
│ Humedad:        ${cur.relative_humidity_2m}${units.relative_humidity_2m} 💧                  │
╰─────────────────────────────────────────╯

╭─────────────────────────────────────────╮
│ ☁️  CONDICIONES                          │
├─────────────────────────────────────────┤
│ Estado:         ${clima.emoji} ${clima.descripcion} 
│ Precipitación:  ${cur.precipitation_probability}${units.precipitation_probability} 🌧️                  │
│ Acumulada:      ${cur.precipitation} ${units.precipitation}                  │
╰─────────────────────────────────────────╯

╭─────────────────────────────────────────╮
│ 💨 VIENTO                                │
├─────────────────────────────────────────┤
│ Velocidad:      ${cur.wind_speed_10m} ${units.wind_speed_10m}               │
│ Dirección:      ${viento.emoji}  ${viento.direccion} (${cur.wind_direction_10m}${units.wind_direction_10m})           │
╰─────────────────────────────────────────╯
`;
}

// TAREA 6: Exportar todo para que weather.js pueda usarlo

module.exports = {
  obtenerDatosMeteo,
  interpretarCodigoTiempo,
  interpretarDireccionViento,
  formatearDatosMeteo
};