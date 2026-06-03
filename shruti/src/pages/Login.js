import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="form-container">
                <h2>Welcome Back</h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>✕ {error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="input-field"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
                    Don't have an account? <a href="/signup" style={{ color: "#4f46e5", textDecoration: "none" }}>Sign up</a>
                </p>
            </div>
        </div>
    );
}
export default Login;