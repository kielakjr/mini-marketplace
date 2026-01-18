import { getAllProducts } from '../api/products'
import { useLoaderData, Await } from 'react-router-dom'
import { Suspense } from 'react'
import Product from '../components/Product'

export default function Home() {
  const { products } = useLoaderData()

  return (
    <div>
      <h1>Produkty</h1>
      <Suspense fallback={<div>Loading products...</div>}>
        <Await resolve={products} errorElement={<div>Couldn't load products.</div>}>
          {(resolvedProducts) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {resolvedProducts.map((product) => (
                <Product key={product.id} product={product} id={product.id} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export async function loader() {
  return {
    products: getAllProducts()
  }
}
