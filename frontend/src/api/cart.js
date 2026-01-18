export async function getCart() {
  const res = await fetch('/api/cart', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
  if (!res.ok) throw new Error('Could not fetch cart')
  return res.json()
}

export async function addToCart(productId, quantity = 1) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!res.ok) throw new Error('Could not add to cart')
  return res.json()
}

export async function removeFromCart(cartItemId) {
  const res = await fetch(`/api/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
  })
  if (!res.ok) throw new Error('Could not remove from cart')
  return res.json()
}

export async function updateCartQuantity(cartItemId, quantity) {
  const res = await fetch(`/api/cart/${cartItemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) throw new Error('Could not update quantity')
  return res.json()
}
