import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = getInitials(user?.name);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="site-navbar">
      <div className="site-navbar__inner">
        <button
          className="brand"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
          aria-label="Go to home"
        >
          Profolio
        </button>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="avatar" title={user?.name || "Signed in user"}>
                {initials}
              </span>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function getInitials(name = "User") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}

export default Navbar;
