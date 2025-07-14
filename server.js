const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

const DATA_FILE = './ocupaciones.json';

app.use(cors());
app.use(express.json());

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

app.post('/api/ocupaciones', (req, res) => {
  const nuevasOcupaciones = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(nuevasOcupaciones, null, 2), err => {
    if (err) return res.status(500).json({ error: 'No se pudo guardar el archivo' });
    res.json({ status: 'guardado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});