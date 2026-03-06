import express from "express";
import categoryRouter from "./modules/category/category.routes.js";
import productRouter from "./modules/product/product.routes.js";
const app = express();
app.use(express.json());
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.listen(5001, () => {
  console.log(" A A Falou");
});
