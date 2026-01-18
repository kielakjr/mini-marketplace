import React, { useEffect } from 'react'
import { fetchFavorites } from '../api/favorites'
import { useLoaderData } from 'react-router-dom';
import Tile from '../components/ui/Tile';
import Product from '../components/Product';

const Favorites = () => {
  const data = useLoaderData();

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
        <p>Loading favorites...</p>
      </div>
    )
  }


  if (data && data?.favorites) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {data.favorites.length === 0 && (
          <Tile className="p-6 rounded-lg shadow-lg flex flex-col items-center gap-6">
            <p>You have no favorite products.</p>
          </Tile>
        )}
        {data.favorites.map((fav) => (
          <Product key={fav.productId} product={fav} id={fav.productId} />
        ))}
      </ul>
    )
  }
}

export default Favorites

export async function loader() {
  try {
    const favorites = await fetchFavorites();
    return { favorites };
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
  return null;
}
