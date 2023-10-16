const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    if (!this.isProductValid(product)) {
      console.error("Producto no válido. Asegúrese de que todos los campos sean obligatorios y que el código sea único.");
      return;
    }

    try {
      // Leer los productos actuales del archivo
      const products = await this.getProductsFromFile();

      // Asignar un id autoincrementable al nuevo producto
      const newId = this.generateNewId(products);

      // Agregar el nuevo producto al arreglo de productos
      product.id = newId;
      products.push(product);

      // Guardar los productos actualizados en el archivo
      await this.saveProductsToFile(products);

      console.log("Producto agregado satisfactoriamente:", product);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  isProductValid(product) {
    return (
      product &&
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.code &&
      product.stock !== undefined &&
      this.isCodeUnique(product.code)
    );
  }

  isCodeUnique(code) {
    return this.getProductsFromFile()
      .then((products) => !products.some((product) => product.code === code))
      .catch(() => false);
  }

  async getProducts() {
    try {
      const products = await this.getProductsFromFile();
      return products;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProductsFromFile();
      const product = products.find((product) => product.id === id);
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProductsFromFile();
      const index = products.findIndex((product) => product.id === id);

      if (index !== -1) {
        // Actualizar el producto con el mismo id
        updatedProduct.id = id;
        products[index] = updatedProduct;

        // Guardar los productos actualizados en el archivo
        await this.saveProductsToFile(products);

        console.log("Producto actualizado satisfactoriamente:", updatedProduct);
      } else {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProductsFromFile();
      const index = products.findIndex((product) => product.id === id);

      if (index !== -1) {
        // Eliminar el producto con el mismo id
        const deletedProduct = products.splice(index, 1)[0];

        // Guardar los productos actualizados en el archivo
        await this.saveProductsToFile(products);

        console.log("Producto eliminado:", deletedProduct);
      } else {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  async getProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay un error, devolvemos un arreglo vacío
      return [];
    }
  }

  async saveProductsToFile(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al guardar productos en el archivo:", error);
    }
  }

  generateNewId(products) {
    if (products.length === 0) {
      return 1;
    }

    const maxId = Math.max(...products.map((product) => product.id));
    return maxId + 1;
  }
}

module.exports = ProductManager;