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
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
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
  authorize(["ADMIN"]),
  validator({ body: requiredBodySchema }),
  productController.create,
);

productRouter.get(
  "/",
  authorize(["ADMIN", "USER"]),
  validator({ query: querySchema }),
  productController.read,
);

productRouter.put(
  "/:id",
  authorize(["ADMIN"]),
  validator({ body: bodySchema, params: requiredParamsSchema }),
  productController.update,
);

productRouter.delete(
  "/:id",
  authorize(["ADMIN"]),
  validator({ params: requiredParamsSchema }),
  productController.delete,
);

productRouter.use(authenticate);

export default productRouter;
