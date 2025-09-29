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
      query.user = req.user._id;
    } else if (user) {
      query.user = user;
    }

    const tasks = await Task.find(query);
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
      taskUser = req.user._id;
    } else {
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
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role === "user" &&
      task.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
