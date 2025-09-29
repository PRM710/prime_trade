# 📌 Prime Trade Assignment – Backend + Frontend

Here is the **demo link** for the deployed project:  
👉 **Frontend (Vercel):** [https://prime-trade-six.vercel.app/](https://prime-trade-six.vercel.app/)  
👉 **Backend (Render):** [https://prime-trade.onrender.com](https://prime-trade.onrender.com)  

✅ It’s fully working — you can try registering, logging in, creating tasks, and testing role-based features.

---

## ⚙️ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB Atlas, JWT, Bcrypt  
- **Frontend:** React (Vite), React Router, Axios  
- **Database:** MongoDB Atlas (or local MongoDB Compass)  
- **Other:** Docker & Docker Compose setup included

---

## 🚀 Features
- 🔐 **JWT Authentication** (login, register with hashed passwords using bcrypt)  
- 👥 **Role-based Access Control**  
  - **Users:** Can add/delete only their own tasks, can’t see others.  
  - **Admins:** Can view all users, promote normal users to admin, see specific user tasks by clicking their name. Cannot delete/promote/demote other admins.  
  - **Superadmins:** Full power 💪 → Can delete/promote/demote admins, delete users, view and manage all tasks.  
- 📝 **Tasks (CRUD)**  
  - Users can create & delete their own tasks.  
  - Admins/Superadmins can manage tasks of any user.  
- 🎯 **Error & Success Handling**  
  - Clear alerts for login, register, delete, promote, demote, etc.  
- 📑 **API Documentation (Swagger-ready)**  
- 🐳 **Docker Setup** for backend, frontend, and MongoDB (if needed).  

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/PRM710/prime_trade.git
cd https://github.com/PRM710/prime_trade.git
```

---

### 2️⃣ Backend Setup
```bash
cd backend
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=<your-MongoDB-Atlas-cluster>
JWT_SECRET=supersecret
PORT=5000
```

⚠️ Note: You must create your own MongoDB Atlas cluster (or use MongoDB Compass locally) and replace the above connection string with your own.

Now install dependencies and run the backend:
```bash
npm install
npm run dev
```

Backend will run at: [http://localhost:5000](http://localhost:5000)

---

### 3️⃣ Frontend Setup
```bash
cd frontend
```

Install dependencies:
```bash
npm install
npm install axios react-router-dom mongodb
```

Run the frontend:
```bash
npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Setup

If you want to run using Docker:

### Backend
```bash
cd backend
docker build -t prime-backend .
docker run -p 5000:5000 --env-file .env prime-backend
```

### Frontend
```bash
cd frontend
docker build -t prime-frontend .
docker run -p 3000:80 prime-frontend
```

### Docker Compose (optional)
At project root:
```bash
docker-compose up --build
```

This will run both backend and frontend together.

---

## ✅ Summary of Features
- Everyone can **post and delete their own tasks**.  
- No user can see tasks of another user.  
- **Admins & Superadmins** can see all users.  
- **Admins** can promote users to admin, but **cannot delete/demote other admins** → shows: `"You are on the same level!"`.  
- **Superadmins** can delete, promote, or demote admins.  
- **Admins/Superadmins** can see tasks of a specific user by clicking their name.  
- **JWT Authentication & Bcrypt** for password security.  
- **Error/Success messages** shown on the frontend for API responses.  
- **CRUD actions** fully implemented for the Task entity.  

---

## 🏁 Demo Links
- 🌐 Frontend: [https://prime-trade-six.vercel.app/](https://prime-trade-six.vercel.app/)  
- ⚙️ Backend: [https://prime-trade.onrender.com](https://prime-trade.onrender.com)  

Enjoy exploring 🚀
