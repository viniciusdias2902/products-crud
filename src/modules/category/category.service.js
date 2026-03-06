const createCategoryService = (repository) => {
  return {
    async create(data) {
      const category = await repository.create(data);
      return category;
    },
    async read(data) {
      const category = await repository.read(data);
      return category;
    },
    async readAll() {
      const categories = await repository.readAll();
      return categories;
    },
    async update(id, data) {
      const category = await repository.update(id, data);
      return category;
    },
    async delete(id) {
      const category = await repository.delete(id);
      return category;
    },
  };
};

export { createCategoryService };
