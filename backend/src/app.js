import express from 'express';
import { pool } from './db/index.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'API działa 🚀' });
});

app.get('/products', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "Product"`);
  res.json(rows);
});

app.listen(process.env.PORT, () => {
  console.log('API uruchomione');
});
