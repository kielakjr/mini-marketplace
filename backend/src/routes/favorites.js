import express from 'express';
import { pool } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `INSERT INTO "Favorite" ("userId", "productId") VALUES ($1, $2)`,
      [userId, productId]
    );
    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Could not add to favorites', error: err.message });
  }
});

router.delete('/:productId', authenticate, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    await pool.query(
      `DELETE FROM "Favorite" WHERE "userId"=$1 AND "productId"=$2`,
      [userId, productId]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Could not remove from favorites', error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT f."productId", p.title, p.price, p.description,
       COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
       FROM "Favorite" f
       JOIN "Product" p ON f."productId" = p.id
       LEFT JOIN "ProductImage" pi ON p.id = pi."productId"
       WHERE f."userId" = $1
       GROUP BY f."productId", p.title, p.price, p.description`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch favorites', error: err.message });
  }
});

export default router;
