import express from 'express';
import { pool } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole('ADMIN'),
  async (req, res) => {
    const { rows } = await pool.query(`
      SELECT
        o.*,
        u.email
      FROM "Order" o
      JOIN "User" u ON u.id = o."userId"
      ORDER BY o."createdAt" DESC
    `);

    res.json(rows);
  }
);


router.get(
  '/my',
  authenticate,
  async (req, res) => {
    const { rows } = await pool.query(`
      SELECT *
      FROM "Order"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
    `, [req.user.id]);

    res.json(rows);
  }
);

router.get(
  '/:id',
  authenticate,
  async (req, res) => {
    const orderId = req.params.id;

    const orderQuery = req.user.role === 'ADMIN'
      ? `
        SELECT * FROM "Order"
        WHERE id = $1
      `
      : `
        SELECT * FROM "Order"
        WHERE id = $1 AND "userId" = $2
      `;

    const params = req.user.role === 'ADMIN'
      ? [orderId]
      : [orderId, req.user.id];

    const order = await pool.query(orderQuery, params);

    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const items = await pool.query(`
      SELECT
        oi.*,
        p.title,
        p.price
      FROM "OrderItem" oi
      JOIN "Product" p ON p.id = oi."productId"
      WHERE oi."orderId" = $1
    `, [orderId]);

    res.json({
      ...order.rows[0],
      items: items.rows
    });
  }
);

export default router;
