import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function authMiddleware(req, res, next) {
  console.log('JWT SECRET (LOGIN):', process.env.JWT_SECRET)
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
