import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect route
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Check admin
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

// ✅ Check superadmin
export const superAdminOnly = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin only" });
  }
  next();
};
