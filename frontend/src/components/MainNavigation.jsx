import React from 'react'
import Tile from './ui/Tile'
import { NavLink, Link } from 'react-router-dom';
import LoginButton from './ui/LoginButton';
import Input from './ui/Input';
import { useSelector } from 'react-redux';

const MainNavigation = () => {
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  return (
    <Tile className="
      flex items-center justify-between
    ">
      <div className="flex items-center gap-6">
        <NavLink to="/" className="font-semibold text-lg">Mini Marketplace</NavLink>
        {auth.user && (<NavLink to="/products/new" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Add Product</NavLink>)}
        {auth.user && (<NavLink to="/favorites" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Favorites</NavLink>)}
      </div>
      <Input
        type="search"
        placeholder="Search products..."
      />
      <div className="flex items-center gap-4">
        <NavLink to="/cart" className="relative">Cart ({cart.items.length})</NavLink>
        {!auth.user ? (
          <Link to="/login"><LoginButton /></Link>
        ) : (
          <NavLink to="/profile" className="flex items-center">
          <div className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold">
            {auth.user.name ? auth.user.name[0].toUpperCase() : 'U'}
          </div>
        </NavLink>
        )}
      </div>
    </Tile>
  )
}

export default MainNavigation
