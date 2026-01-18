import React, { use, useEffect } from 'react'
import Tile from '../components/ui/Tile'
import LabeledInput from '../components/ui/LabeledInput'
import { Form } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { postCheckout } from '../api/checkout'
import { useActionData } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../store/cart-slice'
import { useDispatch } from 'react-redux'

const Checkout = () => {
  const data = useActionData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.success) {
      alert('Order placed successfully!')
      dispatch(clearCart());
      navigate('/');
    } else if (data?.error) {
      alert(`Error: ${data.error}`)
    }
  }, [data]);

  return (
    <Tile className="w-1/2 items-center justify-center p-4 text-center mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Form method="post" className="w-full flex flex-col gap-4 items-center">
        <LabeledInput>
          <label htmlFor="city" className="block mb-1 text-xl">City</label>
          <Input type="text" id="city" name="city" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="address" className="block mb-1 text-xl">Address</label>
          <Input type="text" id="address" name="address" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="country" className="block mb-1 text-xl">Country</label>
          <Input type="text" id="country" name="country" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="zip" className="block mb-1 text-xl">Zip Code</label>
          <Input type="text" id="zip" name="zip" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="payment" className="block mb-1 text-xl">Payment Method</label>
          <select id="payment" name="payment" className="w-full p-2 border rounded focus:outline-0" required>
            <option value="CARD">Credit Card</option>
            <option value="BLIK">Blik</option>
            <option value="TRANSFER">Bank Transfer</option>
          </select>
        </LabeledInput>
        <Button type="submit">
          Place Order
        </Button>
      </Form>
    </Tile>
  )
}

export default Checkout

export async function action({ request }) {
  const formData = await request.formData()
  const orderData = {
    address: {
      city: formData.get('city'),
      line1: formData.get('address'),
      country: formData.get('country'),
      zip: formData.get('zip'),
    },
    paymentMethod: formData.get('payment'),
  }

  try {
    await postCheckout(orderData)
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}
