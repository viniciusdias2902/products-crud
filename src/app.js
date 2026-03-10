import express from "express";
import categoryRouter from "./modules/category/category.routes.js";
import productRouter from "./modules/product/product.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRouter from "./modules/user/auth.routes.js";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/categories", categoryRouter);
  app.use("/products", productRouter);
  app.use("/auth", authRouter);
  app.use(errorHandler);
  return app;
};

export { createApp };
