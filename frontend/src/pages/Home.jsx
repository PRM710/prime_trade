import { Link } from "react-router-dom";
import "./Home.css"; // ✅ import CSS

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome!!</h1>
        <h2>Prakash Mane Here!</h2>
        <p>Please choose an option:</p>
        <div className="home-buttons">
          <Link to="/register">
            <button>Register</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
