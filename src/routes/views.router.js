import express from 'express';
import { promises as fsPromises } from 'fs';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { readFile } = fsPromises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productsData = await readFile('products.json', 'utf-8');
    const products = JSON.parse(productsData);

    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const productsData = await readFile('products.json', 'utf-8');
    const products = JSON.parse(productsData);

    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos en tiempo real.' });
  }
});

export default router;
