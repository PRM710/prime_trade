import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css"; // ✅ Import styles

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchTasks();
    if (role === "admin" || role === "superadmin") fetchUsers();
  }, []);

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      alert("Please login first!");
      navigate("/login");
    }
  };

  // ✅ Fetch users (admins + superadmins only)
  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
  };

  const addTask = async (userId = null) => {
    if (!newTask.trim()) return;
    await API.post("/tasks", userId ? { title: newTask, user: userId } : { title: newTask });
    setNewTask("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const makeAdmin = async (id) => {
    const res = await API.put(`/auth/make-admin/${id}`);
    alert(res.data.message);
    fetchUsers();
  };

  const removeAdmin = async (id) => {
    const res = await API.put(`/auth/remove-admin/${id}`);
    alert(res.data.message);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const res = await API.delete(`/auth/users/${id}`);
    alert(res.data.message);
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* User info */}
        <p className="user-info">
          Logged in as <strong>{email}</strong> ({role})
        </p>

        {/* Normal user task input */}
        {role === "user" && (
          <div className="task-input">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New Task"
            />
            <button onClick={() => addTask()}>Add</button>
          </div>
        )}

        {/* Task List */}
        <h3>Tasks</h3>
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t._id}>
              {t.title}
              <div className="task-actions">
                <button
                  onClick={() => deleteTask(t._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Admin / Superadmin Panel */}
        {(role === "admin" || role === "superadmin") && (
          <div className="panel">
            <h3>{role === "superadmin" ? "Superadmin Panel" : "Admin Panel"}</h3>
            <ul className="user-list">
              {users.map((u) => (
                <li key={u._id}>
                  {u.email} ({u.role})
                  <div className="user-actions">
                    {/* Promote user → admin */}
                    {u.role === "user" && (
                      <button
                        onClick={() => makeAdmin(u._id)}
                        className="promote-btn"
                      >
                        Promote to Admin
                      </button>
                    )}

                    {/* Superadmin can demote admins */}
                    {role === "superadmin" && u.role === "admin" && (
                      <button
                        onClick={() => removeAdmin(u._id)}
                        className="demote-btn"
                      >
                        Demote to User
                      </button>
                    )}

                    {/* Delete user */}
                    {u.role !== "superadmin" && (
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    )}

                    {/* Admin/Superadmin can add task for anyone */}
                    <button
                      onClick={() => addTask(u._id)}
                      className="task-btn"
                    >
                      Add Task for {u.role}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
