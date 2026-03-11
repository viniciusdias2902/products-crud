import { email, z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(128),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export { registerSchema, loginSchema, refreshSchema };
