import { email } from "zod";
import { comparePassword, hashPassword } from "../../utils/password.js";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-troque-em-producao";
const JWT_EXPIRES_IN = "1h";

const createAuthService = (userRepository) => {
  return {
    async register(data) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        const error = new Error("Email Already Registred");
        error.statusCode = 409;
        throw error;
      }
      const hashedPassword = await hashPassword(data.password);
      const user = await userRepository.create({
        ...data,
        password: hashedPassword,
      });
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      };
    },
    async login(email, password) {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error("Invalid Credentials");
        error.statusCode = 401;
        throw error;
      }
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      };
    },
  };
};

export { createAuthService };
