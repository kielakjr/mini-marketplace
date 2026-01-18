import express from 'express';
import { pool } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { getCartItems } from '../services/cart-services.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const rows = await getCartItems(req.user.id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const id = crypto.randomUUID();
    await pool.query(`
      INSERT INTO "CartItem" (id, "userId", "productId", quantity)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("userId", "productId")
      DO UPDATE SET quantity = "CartItem".quantity + EXCLUDED.quantity
    `, [id, req.user.id, productId, quantity || 1]);
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query(`DELETE FROM "CartItem" WHERE id = $1 AND "userId" = $2`, [req.params.id, req.user.id]);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  const { quantity } = req.body;
  try {
    await pool.query(`UPDATE "CartItem" SET quantity = $1 WHERE id = $2 AND "userId" = $3`, [quantity, req.params.id, req.user.id]);
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
