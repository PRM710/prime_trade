import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET tasks
router.get("/", protect, async (req, res) => {
  try {
    const { user } = req.query;
    let query = {};

    if (req.user.role === "user") {
      // Normal user → only own tasks
      query.user = req.user._id;
    } else if (user) {
      // Admin/Superadmin viewing a selected user
      query.user = user;
    }

    const tasks = await Task.find(query).populate("user", "email role");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE task
router.post("/", protect, async (req, res) => {
  try {
    const { title, user } = req.body;

    let taskUser;
    if (req.user.role === "user") {
      // User → can only create tasks for themselves
      taskUser = req.user._id;
    } else {
      // Admin/Superadmin → can create tasks for others
      taskUser = user || req.user._id;
    }

    const task = await Task.create({ title, user: taskUser });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user", "role");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Normal users → only delete their own tasks
    if (
      req.user.role === "user" &&
      task.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Admins → cannot delete tasks of other admins or superadmins
    if (
      req.user.role === "admin" &&
      (task.user.role === "admin" || task.user.role === "superadmin")
    ) {
      return res
        .status(403)
        .json({ message: "Admins cannot delete tasks of other admins/superadmins" });
    }

    // Superadmins → can delete anyone’s tasks
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
