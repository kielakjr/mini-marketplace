import React from 'react'
import Tile from './ui/Tile'
import { NavLink } from 'react-router-dom';

const MainNavigation = () => {
  return (
    <Tile className="
      flex items-center justify-between
    ">
      <NavLink to="/" className="font-semibold text-lg">Mini Marketplace</NavLink>
      <input
        type="search"
        placeholder="Search products..."
        className="
          px-3 py-1.5 rounded-md
          bg-white/30 text-white placeholder-white/70
          outline-none
          focus:ring-2 focus:ring-white/50
          border border-white/20
          backdrop-blur-md
          shadow-[0_4px_15px_rgb(0,0,0,0.1)]
          transition-all duration-200
          w-96
        "
      />
      <div>
        <p>Cart (0)</p>
        <p>Login</p>
      </div>
    </Tile>
  )
}

export default MainNavigation
