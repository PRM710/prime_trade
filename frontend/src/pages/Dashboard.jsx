import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css"; // ✅ use your styled CSS

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // ✅ track selected user
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (role === "admin" || role === "superadmin") {
      fetchUsers();
    } else {
      fetchTasks(); // normal user only sees their own tasks
    }
  }, []);

  // ✅ Fetch tasks (all for user / filtered for admin based on selected user)
  const fetchTasks = async (userId = null) => {
    try {
      const url = userId ? `/tasks?user=${userId}` : "/tasks";
      const res = await API.get(url);
      setTasks(res.data);
    } catch {
      alert("Please login first!");
      navigate("/login");
    }
  };

  // ✅ Fetch all users
  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
  };

  const addTask = async (userId = null) => {
    if (!newTask.trim()) return;
    await API.post("/tasks", userId ? { title: newTask, user: userId } : { title: newTask });
    setNewTask("");
    fetchTasks(selectedUser || null);
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks(selectedUser || null);
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
  try {
    const res = await API.delete(`/auth/users/${id}`);
    alert(res.data.message);
    fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || "Delete failed");
  }
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

        <p className="user-info">
          Logged in as <strong>{email}</strong> ({role})
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* LEFT SIDE: Tasks */}
          <div style={{ flex: 2 }}>
            <h3>
              {role === "admin" || role === "superadmin"
                ? selectedUser
                  ? `Tasks of ${users.find((u) => u._id === selectedUser)?.email}`
                  : "Select a user to view tasks"
                : "My Tasks"}
            </h3>

            {/* Only show input if normal user OR admin viewing a selected user */}
            {(role === "user" || selectedUser) && (
              <div className="task-input">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New Task"
                />
                <button onClick={() => addTask(selectedUser || null)}>Add</button>
              </div>
            )}

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
          </div>

          {/* RIGHT SIDE: Users (only admins/superadmins) */}
          {(role === "admin" || role === "superadmin") && (
            <div style={{ flex: 1 }} className="panel">
              <h3>{role === "superadmin" ? "Superadmin Panel" : "Admin Panel"}</h3>
              <ul className="user-list">
                {users.map((u) => (
                  <li
                    key={u._id}
                    style={{
                      background:
                        u._id === selectedUser ? "#e3f2fd" : "white",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedUser(u._id);
                      fetchTasks(u._id);
                    }}
                  >
                    {u.email} ({u.role})
                    <div className="user-actions">
                      {u.role === "user" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            makeAdmin(u._id);
                          }}
                          className="promote-btn"
                        >
                          Promote
                        </button>
                      )}

                      {role === "superadmin" && u.role === "admin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAdmin(u._id);
                          }}
                          className="demote-btn"
                        >
                          Demote
                        </button>
                      )}

                      {u.role !== "superadmin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(u._id);
                          }}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
