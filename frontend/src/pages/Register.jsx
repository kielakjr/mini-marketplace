import React from 'react'
import { Form } from 'react-router-dom';
import Tile from '../components/ui/Tile';
import Input from '../components/ui/Input';
import LabeledInput from '../components/ui/LabeledInput';
import Button from '../components/ui/Button';
import { registerUser } from '../api/auth';
import { useActionData } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth-slice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const data = useActionData()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (data?.user) {
      dispatch(login({ user: data.user }))
      localStorage.setItem('token', data.token)
      navigate('/')
    }
  }, [data, dispatch, navigate])

  return (
    <Tile className="w-1/3 mx-auto mt-20 p-8">
      <Form method="post" className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <LabeledInput>
          <label htmlFor="email">Email:</label>
          <Input type="email" id="email" name="email" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="username">Username:</label>
          <Input type="text" id="username" name="username" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="password">Password:</label>
          <Input type="password" id="password" name="password" required />
        </LabeledInput>
        <Button type="submit">Register</Button>
      </Form>
      <div className="mt-4 text-center text-white/70">
        <p>Already have an account? <a href="/login" className="underline">Login here</a></p>
      </div>
    </Tile>
  )
}

export default Register


export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const name = formData.get('username')
  const password = formData.get('password')

  console.log('Register action called with:', { email, username, password })

  try {
    const data = await registerUser({ email, name, password })
    return { user: data.user, token: data.token }
  } catch (error) {
    return { error: error.message }
  }
}

