import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UserGreeting from "./UserGreeting";

function ProtectedLayout() {
  const { isAuthenticated, loading, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      addToast("Session expired. Please sign in again.", "error");
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth-error", handleUnauthorized);
    return () => window.removeEventListener("auth-error", handleUnauthorized);
  }, [addToast, logout, navigate]);

  if (loading) {
    return (
      <div className="auth-page">
        <div className="loader">
          <span className="spinner" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="protected-layout">
      <Navbar />
      <div className="workspace-shell">
        <Sidebar />
        <main className="workspace-content">
          <UserGreeting />
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ProtectedLayout;
