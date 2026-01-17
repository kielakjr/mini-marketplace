import React from 'react'
import { getProductById } from '../api/products'
import { useLoaderData, Await } from 'react-router-dom'
import { Suspense } from 'react'
import ProductDetailContent from '../components/ProductDetailContent'

const ProductDetail = () => {
  const { product } = useLoaderData();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={product}>
        {(loadedProduct) => (
          <ProductDetailContent product={loadedProduct} />
        )}
      </Await>
    </Suspense>
  )
}

export default ProductDetail

export async function loader({ params }) {
  return {
    product: getProductById(params.productId)
  }
}
