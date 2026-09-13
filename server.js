require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./db/database'); // creates jansaarthi.db + tables on first run

const authRoutes = require('./routes/auth');
const officerRoutes = require('./routes/officer');
const assistantRoutes = require('./routes/assistant');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'jansaarthi-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/assistant', assistantRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`JanSaarthi backend running on http://localhost:${PORT}`);
  console.log(`SMS provider: ${(process.env.SMS_PROVIDER || 'console').toUpperCase()}`);
  console.log(`AI provider:  ${(process.env.AI_PROVIDER || 'echo').toUpperCase()}`);
});
