import express from "express";
import { createProductRepository } from "./product.repository.js";
import { createProductService } from "./product.service.js";
import { createProductController } from "./product.controller.js";
import { prisma } from "../../lib/prisma.js";
import { validator } from "../../middlewares/validator.js";
import {
  bodySchema,
  querySchema,
  requiredBodySchema,
} from "./product.schemas.js";
import { createCategoryRepository } from "../category/category.repository.js";
import { requiredParamsSchema } from "../../utils/schemas.js";
const productRouter = express.Router();

const productRepository = createProductRepository(prisma);
const categoryRepository = createCategoryRepository(prisma);
const productService = createProductService(
  productRepository,
  categoryRepository,
);
const productController = createProductController(productService);

productRouter.post(
  "/",
  validator({ body: requiredBodySchema }),
  productController.create,
);

productRouter.get(
  "/",
  validator({ query: querySchema }),
  productController.read,
);

productRouter.put(
  "/:id",
  validator({ body: bodySchema, params: requiredParamsSchema }),
  productController.update,
);

productRouter.delete(
  "/:id",
  validator({ params: requiredParamsSchema }),
  productController.delete,
);

export default productRouter;
