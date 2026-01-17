import express from 'express';
import { pool } from './db/index.js';
import productsRouter from './routes/products.js';

const app = express();
app.use(express.json());

app.use('/products', productsRouter);

app.listen(process.env.PORT, () => {
  console.log('API uruchomione');
});
