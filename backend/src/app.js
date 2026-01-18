import express from 'express';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import ordersRouter from './routes/orders.js';
import favoritesRouter from './routes/favorites.js';
import categoriesRouter from './routes/categories.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);
app.use('/favorites', favoritesRouter);
app.use('/categories', categoriesRouter);

app.listen(process.env.PORT, () => {
  console.log('API uruchomione');
});
