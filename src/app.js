const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 8080;

app.use(express.json());

// Rutas para productos
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
