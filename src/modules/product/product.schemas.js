import { z } from "zod";
import { nameSchema } from "../../utils/schemas.js";

const bodySchema = z.object({
  name: nameSchema,
  stock: z.int().optional(),
  price: z.float64().optional(),
  categoryId: z.uuid().optional(),
});

const requiredBodySchema = z.object({
  name: nameSchema,
  stock: z.int().optional(),
  price: z.float64().optional(),
  categoryId: z.uuid().optional(),
});

const querySchema = z.object({
  id: z.uuid().optional(),
  sku: z.string().optional(),
  categoryId: z.uuid().optional(),
});

const paramsSchema = z.object({
  id: z.uuid(),
});

export { bodySchema, requiredBodySchema, querySchema, paramsSchema };
