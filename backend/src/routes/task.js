import express from "express";
import Task from "../models/Task.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create task (user can only for self, admin/superadmin for anyone)
router.post("/", protect, async (req, res) => {
  let owner = req.user._id;
  if ((req.user.role === "admin" || req.user.role === "superadmin") && req.body.user) {
    owner = req.body.user; // allow admin to create task for another user
  }
  const task = await Task.create({ ...req.body, user: owner });
  res.status(201).json(task);
});

// ✅ Get tasks
router.get("/", protect, async (req, res) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    const tasks = await Task.find().populate("user", "email role");
    return res.json(tasks);
  }
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// ✅ Update task
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ✅ Delete task
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

export default router;
