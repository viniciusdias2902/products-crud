import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = {
    userId: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };
  console.log(decoded.role);
  next();
};

export { authenticate };
