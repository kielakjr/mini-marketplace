import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM "Category"`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch categories', error: err.message });
  }
});

export default router;
