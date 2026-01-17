import express from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db/index.js'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../utlis/auth.middleware.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body

  try {
    const existing = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    await pool.query(
      `
      INSERT INTO "User" (id, email, "passwordHash", name, role)
      VALUES ($1, $2, $3, $4, 'USER')
      `,
      [id, email, hashedPassword, name]
    )

    const token = jwt.sign(
      {
        id: id,
        role: 'USER',
        email: email,
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: id,
        email: email,
        name: name,
        role: 'USER',
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  console.log('JWT SECRET (LOGIN):', process.env.JWT_SECRET)

  const { email, password } = req.body

  try {
    const { rows } = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = rows[0]

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT id, email, name, role FROM "User" WHERE id = $1',
    [req.user.id]
  )

  res.json(result.rows[0])
})


export default router
