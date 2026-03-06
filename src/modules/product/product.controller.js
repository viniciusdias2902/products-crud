import { z } from "zod";

const createProductController = (service) => {
  return {
    async create(req, res) {
      const data = req.validated.body;
      const product = await service.create(data);
      return res.status(201).json(product);
    },
    async read(req, res) {
      const { id, sku, categoryId } = req.validated.query;
      let products;
      if (id) {
        products = await service.read({ id });
      } else if (sku) {
        products = await service.read({ sku });
      } else if (categoryId) {
        products = await service.readByCategory(categoryId);
      } else {
        products = await service.readAll();
      }

      return res.status(200).json(products);
    },
    async update(req, res) {
      const data = req.validated.body;
      const id = req.validated.params.id;
      const updatedProduct = await service.update(id, data);
      return res.status(200).json(updatedProduct);
    },
    async delete(req, res) {
      const id = req.validated.params.id;
      await service.delete(id);
      return res.status(204).send();
    },
  };
};

export { createProductController };
