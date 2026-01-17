import React, { useState } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

const FavoriteButton = ({ isFavorite: initialFavorite = false, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !isFavorite
    setIsFavorite(newState)
    if (onToggle) onToggle(newState)
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <HeartSolid className="w-6 h-6 text-red-500 animate-pulse" />
      ) : (
        <HeartOutline className="w-6 h-6 text-white hover:text-red-400 transition-colors duration-200" />
      )}
    </button>
  )
}

export default FavoriteButton
