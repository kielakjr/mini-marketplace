import React from 'react'
import Tile from './ui/Tile'
import { NavLink, Link } from 'react-router-dom';
import LoginButton from './ui/LoginButton';
import Input from './ui/Input';
import { useSelector } from 'react-redux';

const MainNavigation = () => {
  const auth = useSelector((state) => state.auth);
  return (
    <Tile className="
      flex items-center justify-between
    ">
      <NavLink to="/" className="font-semibold text-lg">Mini Marketplace</NavLink>
      <Input
        type="search"
        placeholder="Search products..."
      />
      <div className="flex items-center gap-4">
        <p>Cart (0)</p>
        {!auth.user ? (
          <Link to="/login"><LoginButton /></Link>
        ) : (
          <p>Welcome, {auth.user.name}</p>
        )}
      </div>
    </Tile>
  )
}

export default MainNavigation
