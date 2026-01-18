import express from 'express';
import { pool } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { getCartItems, clearCart } from '../services/cart-services.js';
import { createOrder } from '../services/orders-services.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { address, paymentMethod } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cartItems = await getCartItems(userId, client);
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const order = await createOrder({
      client,
      userId,
      cartItems,
      address,
      paymentMethod
    });

    await clearCart(userId, client);

    await client.query('COMMIT');

    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});

export default router;
