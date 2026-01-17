import express from 'express';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/products', productsRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT, () => {
  console.log('API uruchomione');
});
