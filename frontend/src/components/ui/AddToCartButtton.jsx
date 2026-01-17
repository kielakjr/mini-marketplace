import React from 'react'

const AddToCartButtton = ({...props}) => {
  return (
    <button className="
      px-4 py-2
      bg-white/20 text-white
      rounded-md
      hover:bg-white/30
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-white/50
      shadow-md
      cursor-pointer
    "
      {...props}>
      Add to Cart
    </button>
  )
}

export default AddToCartButtton
