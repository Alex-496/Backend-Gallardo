import express from 'express';
const router = express.Router();
import { promises as fsPromises } from 'fs';
const { readFile, writeFile } = fsPromises;

// Función para generar un ID único para un carrito
function generateCartId(carts) {
  if (!carts || carts.length === 0) {
    // Si no hay carritos, comienza desde 1
    return '1';
  }

  // Encontrar el máximo ID existente
  const maxId = Math.max(...carts.map((cart) => parseInt(cart.id)));

  // Incrementar el ID máximo en 1 para generar un nuevo ID
  return (maxId + 1).toString();
}

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const carts = await readFile('carts.json', 'utf-8');
    const parsedCarts = JSON.parse(carts);

    // Genera un nuevo carrito con un ID único
    const newCart = {
      id: generateCartId(parsedCarts),
      products: []
    };

    parsedCarts.push(newCart);

    await writeFile('carts.json', JSON.stringify(parsedCarts, null, 2));
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});

// Ruta para obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carts = await readFile('carts.json', 'utf-8');
    const parsedCarts = JSON.parse(carts);
    const cart = parsedCarts.find((cart) => cart.id === cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const carts = await readFile('carts.json', 'utf-8');
    const parsedCarts = JSON.parse(carts);
    const cart = parsedCarts.find((cart) => cart.id === cartId);

    if (cart) {
      const existingProduct = cart.products.find((product) => product.product === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        // Agregar el producto como un nuevo objeto al carrito
        cart.products.push({ product: productId, quantity });
      }

      await writeFile('carts.json', JSON.stringify(parsedCarts, null, 2));
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito.' });
  }
})

export default router;
