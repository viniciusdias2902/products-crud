import { z } from "zod";
import { nameSchema } from "../../utils/schemas.js";
const bodySchema = z.object({
  name: nameSchema,
});
const querySchema = z.object({
  id: z.uuid().optional(),
  name: nameSchema.optional(),
});

export { bodySchema, querySchema };
