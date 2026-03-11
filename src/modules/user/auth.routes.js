import express from "express";
import { prisma } from "../../lib/prisma.js";
import { createUserRepository } from "./user.repository.js";
import { createAuthService } from "./auth.service.js";
import { createAuthController } from "./auth.controller.js";
import { validator } from "../../middlewares/validator.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { loginSchema, registerSchema, refreshSchema } from "./auth.schemas.js";

const authRouter = express.Router();

const userRepository = createUserRepository(prisma);
const authService = createAuthService(userRepository);
const authController = createAuthController(authService);

authRouter.post(
  "/register",
  validator({ body: registerSchema }),
  authController.register,
);

authRouter.post(
  "/login",
  validator({ body: loginSchema }),
  authController.login,
);

authRouter.post(
  "/refresh",
  validator({ body: refreshSchema }),
  authController.refresh,
);

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
