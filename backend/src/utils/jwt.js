import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (user) => {
  const roleName = user.role?.name || user.role;
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: roleName,
    },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
};
