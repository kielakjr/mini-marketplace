import React, { useState } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { addFavorite, removeFavorite } from '../../api/favorites'
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite as addFavoriteAction, removeFavorite as removeFavoriteAction } from '../../store/favorites-slice';

const FavoriteButton = ({ productId }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) {
    return null;
  }
  const favorites = useSelector(state => state.favorites.items);
  const isFav = favorites.find(fav => fav.productId === productId) ? true : false;
  const [isFavorite, setIsFavorite] = useState(isFav);

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !isFavorite
    if (newState) {
      addFavorite(productId);
      dispatch(addFavoriteAction({ productId }));
    } else {
      removeFavorite(productId);
      dispatch(removeFavoriteAction(productId));
    }
    setIsFavorite(newState)
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center cursor-pointer"
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
