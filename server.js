const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Шаг 1: заметки хранятся в памяти. После перезапуска контейнера они пропадут.
// На шаге с Docker Compose перенесём их в базу данных.
let notes = [];
let nextId = 1;

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const text = String(req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'Текст заметки не может быть пустым' });
  }
  const note = { id: nextId++, text, createdAt: new Date().toISOString() };
  notes.unshift(note);
  res.status(201).json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Notes app запущено на порту ${PORT}`);
});
