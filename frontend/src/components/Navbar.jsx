import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="nav-bar">
      <div className="nav-brand">SHECARES 🌸</div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {currentUser && <Link to="/pcos" className="nav-link">PCOS Check</Link>}
        {currentUser && <Link to="/nutrition" className="nav-link">Nutrition</Link>}
        {currentUser && <Link to="/reminder" className="nav-link">Reminders</Link>}
        {currentUser && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
        {currentUser && <Link to="/report" className="nav-link">Report</Link>}
      </div>

      <div className="nav-actions">
        {currentUser ? (
          <button className="nav-action-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="nav-action-btn">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar