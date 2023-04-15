const express = require('express');
const app = express();
const port = 3000;

// Configurar la base de datos
const csv = require('csv-parser');
const fs = require('fs');
const centros = [];

fs.createReadStream('centros-trabajo.csv')
  .pipe(csv())
  .on('data', (data) => {
    centros.push(data);
    
  })
  .on('end', () => {
    console.log(`${centros.length} centros de trabajo cargados.`);
  });

// Configurar la API de Google Maps
const { google } = require('googleapis');
const apiKey = 'AIzaSyDkHyWs_avynZ_gkzWysPcxlJRZZQEbHUM';
const maps = google.blogger({
  version: 'v3',
  key: apiKey
});

// Configurar las rutas del servidor
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
 
});

app.get('/centros', (req, res) => {
  const estado = req.query.estado;
  const nivel = req.query.nivel;
  const ambito = req.query.ambito;
  const sostenimiento=req.query.sostenimiento;
  const subcontrol=req.query.subcontrol;
  const resultados = centros.filter(centro => centro.C_ADMINISTRATIVA === estado && centro.TIPONIVELSUB_C_SERVICION2 === nivel && centro.INMUEBLE_C_NOM_AMBITO=== ambito && centro.SOSTENIMIENTO_C_CONTROL=== sostenimiento&& centro.SOSTENIMIENTO_C_SUBCONTROL=== subcontrol);
  const datos = resultados.map(centro => ({
    nombre: centro.C_NOMBRE,
    estado:centro.C_ADMINISTRATIVA,
    direccion: `${centro.INMUEBLE_C_VIALIDAD_PRINCIPAL} Calle derecha:${centro.INMUEBLE_C_VIALIDAD_DERECHA},Calle izquierda: ${centro.INMUEBLE_C_VIALIDAD_IZQUIERDA}, Calle posterior:${centro.INMUEBLE_C_VIALIDAD_POSTERIOR},No:Exterior: ${centro.INMUEBLE_N_EXTNUM}`,
    nivel:centro.TIPONIVELSUB_C_SERVICION2,
    ambito: centro.INMUEBLE_C_NOM_AMBITO,
    sostenimiento:centro.SOSTENIMIENTO_C_CONTROL,
    subcontrol:centro.SOSTENIMIENTO_C_SUBCONTROL,
    latitud: parseFloat(centro.INMUEBLE_LATITUD),
    longitud: parseFloat(centro.INMUEBLE_LONGITUD)
  }));
  res.send(datos);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
})