import React from 'react'
import Tile from '../components/ui/Tile'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from '../store/auth-slice'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Tile className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      {auth.user ? (
        <div>
          <p><strong>Name:</strong> {auth.user.name}</p>
          <p><strong>Email:</strong> {auth.user.email}</p>
          <p><strong>Role:</strong> {auth.user.role}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
      <Button onClick={() => {
        dispatch(logout());
        navigate('/login');
      }}>Logout</Button>
    </Tile>
  )
}

export default Profile
