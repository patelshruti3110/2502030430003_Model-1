import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <h1 className="logo">🎨 Portfolio Builder</h1>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/create">Create</Link>
                        <button 
                            onClick={handleLogout}
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)',
                                border: 'none',
                                color: 'white',
                                padding: '8px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
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
        </nav>
    );
}
export default Navbar;