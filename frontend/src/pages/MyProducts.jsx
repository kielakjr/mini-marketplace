import React, { Suspense } from 'react'
import { getMyProducts } from '../api/products'
import Tile from '../components/ui/Tile'
import { useLoaderData } from 'react-router-dom';
import { Await } from 'react-router-dom';
import Product from '../components/Product';


const MyProducts = () => {
  const data = useLoaderData();

  return (
    <Suspense fallback={<Tile>Loading your products...</Tile>}>
      <Await resolve={data.products} errorElement={<Tile>Couldn't load your products.</Tile>}>
        {(resolvedProducts) => (
          <div>
            <h1 className="text-2xl font-bold mb-4">My Products</h1>
            {resolvedProducts.length === 0 ? (
              <Tile>You have not added any products yet.</Tile>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {resolvedProducts.map((product) => (
                  <Product key={product.id} product={product} id={product.id} />
                ))}
              </div>
            )}
          </div>
        )}
      </Await>
    </Suspense>
  )
}

export default MyProducts

export async function loader() {
  return {
    products: getMyProducts()
  }
}
