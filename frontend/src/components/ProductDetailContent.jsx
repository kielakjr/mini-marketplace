import React from 'react'
import { useState } from 'react'
import Tile from './ui/Tile'
import Line from './ui/Line'
import AddToCartButtton from './ui/AddToCartButtton'
import FavoriteButton from './ui/FavoriteButton'

const ProductDetailContent = ({ product }) => {
  const { title, description, price, images, createdAt } = product;
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNextImage = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }


  return (
    <Tile className=" p-6 rounded-lg shadow-lg flex flex-col items-center gap-6">
      {images.length === 0 && (
        <div className="w-full h-48 mb-4 flex items-center justify-center rounded-md">
          <div className="text-white/50">No images available</div>
        </div>
      )}
      {images && images.length > 0 && (
          <div className="relative w-full h-48 mb-4">
            <img
              src={images[currentImageIndex].url}
              alt={title}
              className="w-full h-full object-contain rounded-md"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded"
                >
                  ◀
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded"
                >
                  ▶
                </button>
              </>
            )}
          </div>
        )}
      <Line />
      <div className="w-full flex justify-between items-center mb-2 mt-2">
        <h1 className="text-3xl font-bold mb-2 ml-5">{title}</h1>
        <span className="font-bold text-3xl mr-5">${price}</span>
      </div>
      <div className="w-full text-left px-5">
      <p className="text-white/80 mb-4">{description}</p>
      </div>
      <Line />
      <div className="flex w-full justify-between items-center mt-2">
        <p className="text-left px-5">Added at {new Date(createdAt).toLocaleDateString()}</p>
        <div className="flex gap-4 mr-5">
          <FavoriteButton />
          <AddToCartButtton />
        </div>
      </div>
    </Tile>
  )
}

export default ProductDetailContent
