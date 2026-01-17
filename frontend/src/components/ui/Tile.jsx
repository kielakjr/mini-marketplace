import React from 'react'

const Tile = ({ children, className }) => {

  const classes = `p-4 rounded-2xl
      backdrop-blur-xl
      border border-white/20
      text-white
      shadow-[0_8px_30px_rgb(0,0,0,0.12)]
      bg-black/30
      m-4 ${className}`;

  return (
    <div className={classes}>{children}</div>
  )
}

export default Tile
