import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <h2>TechFest 2026</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact & Security</Link>
        <Link to="/cart">
          Cart <span className="badge">{cart.length}</span>
        </Link>
        {token ? (
          <>
            <Link to="/my-registrations">My Events</Link>
            <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>({userName})</span>
            <button onClick={handleLogout} style={{ padding: "0.2rem 0.6rem", fontSize: "0.85rem" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
      <button onClick={toggleTheme} aria-label="Toggle dark/light theme">
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </nav>
  );
}

export default Navbar;
