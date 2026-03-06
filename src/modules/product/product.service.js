import { id } from "zod/locales";

const generateSku = () => {
  return "123";
};

const createProductService = (productRepository, categoryRepository) => {
  return {
    async create(data) {
      const categoryId = data.categoryId;
      const category = await categoryRepository.read({ id: categoryId });
      const prefix = category.name.slice(0, 3).toUpperCase();
      const numberOfProducts = (await productRepository.count(categoryId)) + 1;
      const sku = `${prefix}-${numberOfProducts}`;
      const productData = { ...data, sku };
      console.log(productData);
      const product = await productRepository.create(productData);
      return product;
    },
    async readAll() {
      const products = await productRepository.readAll();
      return products;
    },
    async read(data) {
      const products = await productRepository.read(data);
      return products;
    },
    async readByCategory(categoryId) {
      const products = await productRepository.readByCategory(categoryId);
      return products;
    },
    async update(id, data) {
      const product = await productRepository.update(id, data);
      return product;
    },
    async delete(id) {
      const product = await productRepository.delete(id);
      return product;
    },
  };
};

export { createProductService };
