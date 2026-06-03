import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.message || "Signup failed");
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
                <h2>Create Account</h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>✕ {error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        className="input-field"
                        value={formData.name}
                        onChange={handleChange}
                    />
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
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="input-field"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
                    Already have an account? <a href="/login" style={{ color: "#4f46e5", textDecoration: "none" }}>Login</a>
                </p>
            </div>
        </div>
    );
}
export default Signup;