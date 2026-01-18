import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCart, removeFromCart, updateCartQuantity } from '../api/cart'
import { setCart, removeItem, updateQuantity} from '../store/cart-slice'
import Tile from '../components/ui/Tile'
import Line from '../components/ui/Line'

const CartPage = () => {
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart.items)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart()
        dispatch(setCart(data))
      } catch (err) {
        console.error(err)
      }
    }
    fetchCart()
  }, [dispatch])

  const handleChangeQuantity = async (id, qty) => {
    if (qty <= 0) {
      await removeFromCart(id)
      dispatch(removeItem(id))
      return
    }
    await updateCartQuantity(id, qty)
    dispatch(updateQuantity({ id, quantity: qty }))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Tile className="w-1/2 items-center justify-center p-4 text-center mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your cart</h1>
      {cart.map(item => (
        <div key={item.id}>
        <div className="flex justify-between items-center mb-4">
          <Tile className="w-auto flex items-center my-2">
            <span>{item.title}</span>
          </Tile>
          <div className="flex items-center gap-5">
            <span className="ml-4">{item.price * item.quantity}$</span>
            <button
              onClick={() => handleChangeQuantity(item.id, item.quantity-1)}
              className="px-2 py-1 bg-gray-800 rounded-l cursor-pointer text-white"
            >
              -
            </button>
            <span className="px-4">{item.quantity}</span>
            <button
              onClick={() => handleChangeQuantity(item.id, item.quantity+1)}
              className="px-2 py-1 bg-gray-800 rounded-r cursor-pointer text-white"
            >
              +
            </button>
          </div>
        </div>
        <Line />
        </div>
      ))}
      <h2>Total: {total}$</h2>
    </Tile>
  )
}

export default CartPage
