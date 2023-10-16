const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();
    const result = limit ? products.slice(0, limit) : products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
