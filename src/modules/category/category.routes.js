import express from "express";
import { createCategoryRepository } from "./category.repository.js";
import { prisma } from "../../lib/prisma.js";
import { createCategoryService } from "./category.service.js";
import { createCategoryController } from "./category.controller.js";
import { validator } from "../../middlewares/validator.js";
import { bodySchema, querySchema } from "./category.schemas.js";
import { paramsSchema, requiredParamsSchema } from "../../utils/schemas.js";
const categoryRouter = express.Router();

const categoryRepository = createCategoryRepository(prisma);
const categoryService = createCategoryService(categoryRepository);
const categoryController = createCategoryController(categoryService);

categoryRouter.post(
  "/",
  validator({ body: bodySchema }),
  categoryController.create,
);
categoryRouter.get(
  "/",
  validator({ query: querySchema }),
  categoryController.read,
);
categoryRouter.put(
  "/:id",
  validator({ body: bodySchema, params: requiredParamsSchema }),
  categoryController.update,
);
categoryRouter.delete(
  "/:id",
  validator({ params: paramsSchema }),
  categoryController.delete,
);

export default categoryRouter;
