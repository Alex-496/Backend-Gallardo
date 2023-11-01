const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

function generateProductId(products) {
  if (!products || products.length === 0) {
    // Si no hay productos, comienza desde 1
    return '1';
  }

  // Encontrar el máximo ID existente
  const maxId = Math.max(...products.map((product) => parseInt(product.id)));

  // Incrementar el ID máximo en 1 para generar un nuevo ID
  return (maxId + 1).toString();
}

// Ruta para listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await fs.readFile('products.json', 'utf-8');
    const parsedProducts = JSON.parse(products);
    let limitedProducts = parsedProducts;

    // Verificar si se proporciona un parámetro "limit" en la consulta
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    if (limit && limit > 0) {
      limitedProducts = parsedProducts.slice(0, limit);
    }

    res.json(limitedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// Ruta para obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const productId = req.params.pid.toString(); // Convierte el parámetro pid en cadena

  try {
    const products = await fs.readFile('products.json', 'utf-8');
    const parsedProducts = JSON.parse(products);
    const product = parsedProducts.find((product) => product.id.toString() === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  const newProduct = req.body;

  // Verificar que todos los campos requeridos estén presentes
  if (
    newProduct.title &&
    newProduct.description &&
    newProduct.code &&
    newProduct.price &&
    newProduct.stock !== undefined &&
    newProduct.category
  ) {
    try {
      const products = await fs.readFile('products.json', 'utf-8');
      const parsedProducts = JSON.parse(products);
      newProduct.id = generateProductId(parsedProducts); // Genera un nuevo ID
      newProduct.status = newProduct.status || true; // Valor por defecto para "status"

      parsedProducts.push(newProduct);
      await fs.writeFile('products.json', JSON.stringify(parsedProducts, null, 2));
      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto.' });
    }
  } else {
    res.status(400).json({ error: 'Faltan campos requeridos en la solicitud.' });
  }
});

// Ruta para actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  try {
    const products = await fs.readFile('products.json', 'utf-8');
    const parsedProducts = JSON.parse(products);
    const index = parsedProducts.findIndex((product) => product.id === productId);

    if (index !== -1) {
      parsedProducts[index] = { ...parsedProducts[index], ...updatedProduct };
      await fs.writeFile('products.json', JSON.stringify(parsedProducts, null, 2));
      res.json(parsedProducts[index]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const products = await fs.readFile('products.json', 'utf-8');
    const parsedProducts = JSON.parse(products);
    const index = parsedProducts.findIndex((product) => product.id === productId);

    if (index !== -1) {
      const deletedProduct = parsedProducts.splice(index, 1)[0];
      await fs.writeFile('products.json', JSON.stringify(parsedProducts, null, 2));
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

module.exports = router;