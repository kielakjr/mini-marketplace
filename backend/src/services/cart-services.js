import { pool } from '../db/index.js';

export async function getCartItems(userId) {
  const { rows } = await pool.query(`
    SELECT
      ci.id,
      ci.quantity,
      p.id AS "productId",
      p.title,
      p.price
    FROM "CartItem" ci
    JOIN "Product" p ON p.id = ci."productId"
    WHERE ci."userId" = $1
  `, [userId])

  return rows
}

export async function clearCart(userId) {
  await pool.query(`
    DELETE FROM "CartItem"
    WHERE "userId" = $1
  `, [userId])
}
