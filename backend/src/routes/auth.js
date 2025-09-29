import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, adminOnly, superAdminOnly } from "../middleware/auth.js";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user", // default user role
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all users (admin/superadmin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ✅ Promote user to admin (admin or superadmin)
router.put("/make-admin/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "admin" || user.role === "superadmin") {
    return res.status(400).json({ message: "Cannot promote an admin/superadmin" });
  }

  user.role = "admin";
  await user.save();
  res.json({ message: `${user.email} promoted to admin`, user });
});

// ✅ Demote admin → user (superadmin only)
router.put("/remove-admin/:id", protect, superAdminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role !== "admin") {
    return res.status(400).json({ message: "Target is not an admin" });
  }

  user.role = "user";
  await user.save();
  res.json({ message: `${user.email} demoted to user`, user });
});

// ✅ Delete user (admin/superadmin)
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "superadmin") {
    return res.status(403).json({ message: "Cannot delete superadmin" });
  }

  if (req.user.role === "admin" && user.role === "admin") {
    return res.status(403).json({ message: "You are on the same level!" });
  }

  await user.deleteOne();
  res.json({ message: `${user.email} deleted` });
});


export default router;
