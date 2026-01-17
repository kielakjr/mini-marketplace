import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllProducts } from '../api/products'
import { setProducts } from '../store/products-slice.js'

const Home = () => {
  const products = useSelector((state) => state.products.items)
  const dispatch = useDispatch()
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        dispatch(setProducts(data))
      } catch (err) {
        setError('Could not fetch products. Please try again later.')
      }
    }
    fetchProducts()
  }, [dispatch])

  return (
    <>
      {error && <div className="">{error}</div>}
      {!error && (
        <div className="">
          {products.map((product) => (
            <div key={product.id} className="">
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <span>Price: ${product.price}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Home
