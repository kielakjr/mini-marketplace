import React from 'react'
import { Form } from 'react-router-dom';
import Tile from '../components/ui/Tile';
import Input from '../components/ui/Input';
import LabeledInput from '../components/ui/LabeledInput';
import LoginButton from '../components/ui/LoginButton';
import { useActionData } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth-slice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const data = useActionData();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (data?.user && data?.token) {
      dispatch(login({ user: data.user }));
      localStorage.setItem('token', data.token);
      navigate('/');
    }
  }, [data, dispatch, navigate]);

  return (
    <Tile className="w-1/3 mx-auto mt-20 p-8">
      <Form method="post" className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <LabeledInput>
          <label htmlFor="email">Email:</label>
          <Input type="email" id="email" name="email" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="password">Password:</label>
          <Input type="password" id="password" name="password" required />
        </LabeledInput>
        <LoginButton type="submit" />
      </Form>
      <div className="mt-4 text-center text-white/70">
        <p>Don't have an account? <a href="/register" className="underline">Register here</a></p>
      </div>
    </Tile>
  )
}

export default Login

export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const data = await loginUser(email, password)
    return {user: data.user, token: data.token}
  } catch (error) {
    return {error: error.message}
  }
}
