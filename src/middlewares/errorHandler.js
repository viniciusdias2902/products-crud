import { Prisma } from "../generated/prisma/client";

const errorHandler = (err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Unique constraint violation",
      });
    }

    if (err.code === "P2003") {
      return res.status(409).json({
        message: "Foreign key constraint violation",
      });
    }
  }

  console.log(err);
  return res.status(500).json({ message: "internal server error" });
};

export { errorHandler };
