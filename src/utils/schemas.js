import { z } from "zod";
const nameSchema = z.string().trim().lowercase().min(2).max(40);

const paramsSchema = z.object({
  id: z.uuid().optional(),
});

const requiredParamsSchema = z.object({
  id: z.uuid(),
});

export { nameSchema, paramsSchema, requiredParamsSchema };
