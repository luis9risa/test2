const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = './ocupaciones.json';

app.use(cors());
app.use(express.json());

// GET ocupaciones
app.get('/api/ocupaciones', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });
    try {
      const ocupaciones = JSON.parse(data);
      res.json(ocupaciones);
    } catch (e) {
      res.status(500).json({ error: 'Error al parsear JSON' });
    }
  });
});

// POST ocupaciones
app.post('/api/ocupaciones', (req, res) => {
  const nuevasOcupaciones = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(nuevasOcupaciones, null, 2), err => {
    if (err) return res.status(500).json({ error: 'No se pudo guardar el archivo' });
    res.json({ status: 'guardado' });
  });
});

// ✅ NUEVO: proxy seguro a MasterTrack
app.post('/api/posiciones', async (req, res) => {
  try {
    const response = await axios.post('http://201.144.124.57:5400/api/v1/getlastpositions', {
      UserID: "transtec",
      Password: "Starsol24",
      scs: "162"
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar MasterTrack' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
