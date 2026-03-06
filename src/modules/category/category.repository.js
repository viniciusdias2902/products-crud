const createCategoryRepository = (prisma) => {
  return {
    async create(data) {
      const category = await prisma.category.create({ data });
      return category;
    },
    async read(data) {
      const category = await prisma.category.findUnique({ where: data });
      return category;
    },
    async readAll() {
      const categories = await prisma.category.findMany();
      return categories;
    },
    async update(id, data) {
      const category = await prisma.category.update({
        where: { id },
        data,
      });
      return category;
    },
    async delete(id) {
      const deletedCategory = await prisma.category.delete({ where: { id } });
      return deletedCategory;
    },
  };
};

export { createCategoryRepository };
