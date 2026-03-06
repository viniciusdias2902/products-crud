import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const createCategoryController = (service) => {
  return {
    async create(req, res) {
      const category = req.validated.body;
      const createdCategory = await service.create(category);
      return res.status(201).json(createdCategory);
    },
    async read(req, res) {
      const { id, name } = req.validated.query;
      let result;
      if (id) {
        result = await service.read({ id });
      } else if (name) {
        result = await service.read({ name });
      } else {
        result = await service.readAll();
      }
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "Not Found" });
      }
    },
    async update(req, res) {
      const id = req.validated.params.id;
      const data = req.validated.body;
      if (!id) {
        return res.status(400).json({ message: "id is required" });
      }
      const result = await service.update(id, data);
      return res.status(200).json(result);
    },
    async delete(req, res) {
      const id = req.validated.params.id;
      await service.delete(id);
      return res.status(204).send();
    },
  };
};

export { createCategoryController };
