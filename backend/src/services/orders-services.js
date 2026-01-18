import crypto from 'crypto';

export async function createOrder({
  client,
  userId,
  cartItems,
  address,
  paymentMethod
}) {
  const orderId = crypto.randomUUID();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await client.query(`
    INSERT INTO "Order" (id, "userId", "totalPrice")
    VALUES ($1, $2, $3)
  `, [orderId, userId, totalPrice]);

  for (const item of cartItems) {
    await client.query(`
      INSERT INTO "OrderItem"
      (id, "orderId", "productId", quantity, "unitPrice")
      VALUES ($1, $2, $3, $4, $5)
    `, [
      crypto.randomUUID(),
      orderId,
      item.productId,
      item.quantity,
      item.price
    ]);
  }

  await client.query(`
    INSERT INTO "Address"
    (id, "userId", line1, city, zip, country)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [
    crypto.randomUUID(),
    userId,
    address.line1,
    address.city,
    address.zip,
    address.country
  ]);

  await client.query(`
    INSERT INTO "Payment"
    (id, "orderId", amount, method)
    VALUES ($1, $2, $3, $4)
  `, [crypto.randomUUID(), orderId, totalPrice, paymentMethod]);

  await client.query(`
    INSERT INTO "Shipment"
    (id, "orderId")
    VALUES ($1, $2)
  `, [crypto.randomUUID(), orderId]);

  await client.query(`
    INSERT INTO "AuditLog"
    (id, "userId", action)
    VALUES ($1, $2, $3)
  `, [crypto.randomUUID(), userId, 'CREATE_ORDER']);

  return { orderId, totalPrice };
}
