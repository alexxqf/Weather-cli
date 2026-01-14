
async function obtenerDatosMeteo(latitude, longitude) {
  try {
    // Definimos la dirección base de la API
    const baseUrl = "https://api.open-meteo.com/v1/forecast";

    // Preparación de los parámetros
    const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      // Pedimos todas las variables que exige el enunciado:
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
      timezone: "auto" // Para que use la hora local de la ubicación
    });

    // Unimos la base con los parámetros
    const url = `${baseUrl}?${params.toString()}`;

    // Hacemos la petición
    const response = await fetch(url);

    // Verificamos si la respuesta fue correcta 
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
    }

    // Convertimos la respuesta de texto a un objeto JSON usable
    const data = await response.json();

    // Retornamos los datos limpios
    return data;

  } catch (error) {
    // Si algo falla, lanzamos un error explicativo
    throw new Error(`Fallo al conectar con Open-Meteo: ${error.message}`);
  }
}

// Exportamos la función para poder usarla en otros archivos
module.exports = {
  obtenerDatosMeteo
};