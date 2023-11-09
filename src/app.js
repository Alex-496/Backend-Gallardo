import express from 'express';
import handlebars from 'express-handlebars';
import { promises as fsPromises } from 'fs';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { readFile, writeFile } = fsPromises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = app.listen(8080, () => console.log('Servidor Express en ejecución en el puerto 8080'));
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

import viewsRouter from './routes/views.router.js';
app.use('/', viewsRouter);

socketServer.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.on('message', (data) => {
    console.log(data);

    // Implementa lógica para enviar actualizaciones a la vista en tiempo real.
    // Por ejemplo, puedes emitir un evento de actualización cuando se crea o elimina un producto.
    // Esto es solo un ejemplo, asegúrate de adaptar la lógica a tus necesidades.
    if (data && data.action === 'productCreated') {
      // Aquí, data.products debe contener la lista actualizada de productos.
      socket.emit('productCreated', data.products);
    } else if (data && data.action === 'productDeleted') {
      // Aquí, data.products debe contener la lista actualizada de productos.
      socket.emit('productDeleted', data.products);
    }
  });
});

import productsRouter from './routes/products.js';
app.use('/api/products', productsRouter);

import cartsRouter from './routes/carts.js';
app.use('/api/carts', cartsRouter);
