import express from 'express';
import { pool } from '../db/index.js';
import crypto from 'crypto';
import { authenticate } from '../middleware/auth.js';

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


router.get('/my', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category,
              COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
       FROM "Product" p
       LEFT JOIN "ProductImage" pi ON p.id = pi."productId"
       LEFT JOIN "Category" c ON p."categoryId" = c.id
       WHERE p."sellerId" = $1
       GROUP BY p.id, c.name`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch your products', error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query(`
      SELECT
        p.*,
        c.name AS category,
        COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
      FROM "Product" p
      LEFT JOIN "ProductImage" pi ON p.id = pi."productId"
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      WHERE p.id = $1
      GROUP BY p.id, c.name
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


router.post('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { title, description, price, images, categoryId } = req.body;

  const productId = crypto.randomUUID();

  try {
    await pool.query(
      `INSERT INTO "Product" (id, title, description, price, "sellerId", "categoryId")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [productId, title, description, price, userId, categoryId]
    );

    if (images && images.length > 0) {
      for (const url of images) {
        await pool.query(
          `INSERT INTO "ProductImage" (id, "productId", url)
           VALUES ($1, $2, $3)`,
          [crypto.randomUUID(), productId, url]
        );
      }
    }

    res.status(201).json({ productId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Could not create product', error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  try {
    await pool.query(
      `DELETE FROM "Product" WHERE id=$1 AND "sellerId"=$2`,
      [productId, userId]
    );
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete product', error: err.message });
  }
});


export default router;
