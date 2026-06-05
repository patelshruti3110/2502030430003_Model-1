import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function NotFound() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="portfolio-section">
      <div className="empty-state">
        <h1 className="page-title">Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
