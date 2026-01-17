import React from 'react'
import Tile from './ui/Tile'

const Product = ({ product }) => {

  const { title, description, price, images } = product


  return (
    <Tile className="mx-auto p-4 transition-transform duration-300 hover:scale-110 cursor-pointer">
      <h2 className="font-semibold text-xl mb-2">{title}</h2>
      <img src={images && images.length > 0 ? images[0].url : ''} alt={title} className="w-full h-48 object-cover mb-4 rounded-md" />
      <p className="text-white/80 mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">${price}</span>
        <button className="
          px-4 py-2
          bg-white/20 text-white
          rounded-md
          hover:bg-white/30
          transition-colors duration-200
        ">
          Add to Cart
        </button>
      </div>
    </Tile>
  )
}

export default Product
