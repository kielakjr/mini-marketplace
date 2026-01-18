import React from 'react'
import Tile from './ui/Tile'
import { Link } from 'react-router-dom';
import AddToCartButtton from './ui/AddToCartButtton';
import FavoriteButton from './ui/FavoriteButton';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cart-slice';
import { addToCart } from '../api/cart';
import { useSelector } from 'react-redux';

const Product = ({ product, id }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [adding, setAdding] = React.useState(false);

  const { title, description, price, images } = product

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart.');
      return;
    }
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
    dispatch(addItem({
      ...product,
      quantity: 1
    }));
  }


  return (
    <Link to={`/products/${id}`}>
      <Tile className="mx-auto p-4 transition-transform duration-300 hover:scale-108 cursor-pointer">
        <h2 className="font-semibold text-xl mb-2">{title}</h2>
        <img src={images && images.length > 0 ? images[0].url : ''} alt={title} className="w-full h-48 object-cover mb-4 rounded-md" />
        <p className="text-white/80 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">${price}</span>
          <div className="flex gap-3">
            <FavoriteButton productId={id}/>
            <AddToCartButtton onClick={handleAddToCart} disabled={adding} />
          </div>
        </div>
      </Tile>
    </Link>
  )
}

export default Product
