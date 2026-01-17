import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.*,
        COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
      FROM "Product" p
      LEFT JOIN "ProductImage" pi ON p.id = pi."productId"
      GROUP BY p.id
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Nie udało się pobrać produktów' })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query(`
      SELECT
        p.*,
        COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
      FROM "Product" p
      LEFT JOIN "ProductImage" pi ON p.id = pi."productId"
      WHERE p.id = $1
      GROUP BY p.id
    `, [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Nie udało się pobrać produktu' })
  }
})


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
