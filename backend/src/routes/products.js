import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "Product"`);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(`SELECT * FROM "Product" WHERE id = $1`, [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  try {
    const { id, title, description, price, sellerId, categoryId } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO "Product" (id, title, description, price, "sellerId", "categoryId")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, title, description, price, sellerId, categoryId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
