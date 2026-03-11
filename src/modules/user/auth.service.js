import { email } from "zod";
import { comparePassword, hashPassword } from "../../utils/password.js";
import jwt from "jsonwebtoken";
import { use } from "react";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;

function generateTokens(user) {
  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

function sanitizeUser(user) {
  const { password, refreshToken, ...safeUser } = user;
  return safeUser;
}

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
      const { accessToken, refreshToken } = generateTokens(user);
      await userRepository.updateRefreshToken(user.id, refreshToken);
      return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
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
      const { token, refreshToken } = generateTokens(user);
      return {
        user: sanitizeUser(user),
        token,
        refreshToken,
      };
    },
    async refresh(refreshToken) {
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      } catch {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
      }
      const user = await userRepository.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        const error = new Error("Refresh token revoked");
        error.statusCode = 401;
        throw error;
      }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        generateTokens(user);
      await userRepository.updateRefreshToken(user.id, newRefreshToken);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    },
    async logout(userId) {
      await userRepository.updateRefreshToken(userId, null);
    },
  };
};

export { createAuthService };
