const { obtenerDatosMeteo, formatearDatosMeteo } = require('./weatherService');

//COORDENADAS DE VIGO 
const LATITUDE = 42.2406;
const LONGITUDE = -8.7207; 

async function main() {
  console.log("⏳ Obteniendo datos del tiempo en Vigo...");

  try {
    // Pedimos los datos para Vigo
    const datos = await obtenerDatosMeteo(LATITUDE, LONGITUDE);
    
    // Formateamos y mostramos
    const tablaResultado = formatearDatosMeteo(datos, LATITUDE, LONGITUDE);
    console.log(tablaResultado);
    
  } catch (error) {
    console.error("❌ Ocurrió un error:");
    console.error(error.message);
    process.exit(1);
  }
}

main();