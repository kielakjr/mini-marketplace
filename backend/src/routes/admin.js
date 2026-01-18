import express from 'express';
import { pool } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import crypto from 'crypto';

const router = express.Router();

/* ===================== USERS ===================== */

router.get('/users', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, email, name, role, "isActive", "createdAt"
    FROM "User"
    ORDER BY "createdAt" DESC
  `);
  res.json(rows);
});

router.patch('/users/:id/status', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { isActive } = req.body;

  await pool.query(
    `UPDATE "User" SET "isActive"=$1 WHERE id=$2`,
    [isActive, req.params.id]
  );

  res.json({ message: 'User status updated' });
});

router.patch('/users/:id/role', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { role } = req.body;

  await pool.query(
    `UPDATE "User" SET role=$1 WHERE id=$2`,
    [role, req.params.id]
  );

  res.json({ message: 'User role updated' });
});


/* ===================== PRODUCTS ===================== */

router.get('/products', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, u.email AS seller, c.name AS category
    FROM "Product" p
    JOIN "User" u ON p."sellerId" = u.id
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    ORDER BY p."createdAt" DESC
  `);
  res.json(rows);
});

router.patch('/products/:id/status', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { isActive } = req.body;

  await pool.query(
    `UPDATE "Product" SET "isActive"=$1 WHERE id=$2`,
    [isActive, req.params.id]
  );

  res.json({ message: 'Product status updated' });
});

router.delete('/products/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  await pool.query(
    `DELETE FROM "Product" WHERE id=$1`,
    [req.params.id]
  );

  res.json({ message: 'Product deleted' });
});


/* ===================== ORDERS ===================== */

router.get('/orders', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.*, u.email
    FROM "Order" o
    JOIN "User" u ON o."userId" = u.id
    ORDER BY o."createdAt" DESC
  `);
  res.json(rows);
});

router.patch('/orders/:id/status', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { status } = req.body;

  await pool.query(
    `UPDATE "Order" SET status=$1 WHERE id=$2`,
    [status, req.params.id]
  );

  res.json({ message: 'Order status updated' });
});


/* ===================== PAYMENTS ===================== */

router.get('/payments', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, o."userId"
    FROM "Payment" p
    LEFT JOIN "Order" o ON p."orderId" = o.id
    ORDER BY p."createdAt" DESC
  `);
  res.json(rows);
});

router.patch('/payments/:id/status', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { status } = req.body;

  await pool.query(
    `UPDATE "Payment" SET status=$1 WHERE id=$2`,
    [status, req.params.id]
  );

  res.json({ message: 'Payment status updated' });
});


/* ===================== SHIPMENTS ===================== */

router.get('/shipments', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT s.*, o."userId"
    FROM "Shipment" s
    LEFT JOIN "Order" o ON s."orderId" = o.id
    ORDER BY s."createdAt" DESC
  `);
  res.json(rows);
});

router.patch('/shipments/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { status, carrier, trackingNumber } = req.body;

  await pool.query(
    `UPDATE "Shipment"
     SET status=$1, carrier=$2, "trackingNumber"=$3
     WHERE id=$4`,
    [status, carrier, trackingNumber, req.params.id]
  );

  res.json({ message: 'Shipment updated' });
});


/* ===================== CATEGORIES ===================== */

router.get('/categories', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT * FROM "Category"
    ORDER BY name
  `);
  res.json(rows);
});

router.post('/categories', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { name, parentId } = req.body;

  await pool.query(
    `INSERT INTO "Category" (id, name, "parentId")
     VALUES ($1, $2, $3)`,
    [crypto.randomUUID(), name, parentId || null]
  );

  res.status(201).json({ message: 'Category created' });
});

router.patch('/categories/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { name, parentId } = req.body;

  await pool.query(
    `UPDATE "Category" SET name=$1, "parentId"=$2 WHERE id=$3`,
    [name, parentId || null, req.params.id]
  );

  res.json({ message: 'Category updated' });
});

router.delete('/categories/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  await pool.query(
    `DELETE FROM "Category" WHERE id=$1`,
    [req.params.id]
  );

  res.json({ message: 'Category deleted' });
});


/* ===================== AUDIT LOGS ===================== */

router.get('/audit-logs', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT a.*, u.email
    FROM "AuditLog" a
    LEFT JOIN "User" u ON a."userId" = u.id
    ORDER BY a."createdAt" DESC
    LIMIT 500
  `);
  res.json(rows);
});

export default router;
