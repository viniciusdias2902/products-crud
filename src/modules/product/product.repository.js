const createProductRepository = (prisma) => {
  return {
    async create(data) {
      const product = await prisma.product.create({ data });
      return product;
    },
    async readAll() {
      const product = await prisma.product.findMany();
      return product;
    },
    async read(data) {
      const product = await prisma.product.findUnique({ where: data });
      return product;
    },
    async readByCategory(categoryId) {
      const products = await prisma.product.findMany({ where: { categoryId } });
      return products;
    },
    async update(id, data) {
      const product = await prisma.product.update({ where: { id }, data });
      return product;
    },
    async delete(id) {
      const deletedProduct = await prisma.product.delete({ where: { id } });
      return deletedProduct;
    },
    async count(categoryId) {
      const numberOfProducts = await prisma.product.count({
        where: { categoryId },
      });
      return numberOfProducts;
    },
  };
};

export { createProductRepository };
