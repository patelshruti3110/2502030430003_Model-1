import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePortfolio() {
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
        about: "",
        skills: "",
        githubLink: "",
        email: "",
        phone: "",
        location: "",
    });
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

        if (!formData.fullName || !formData.role || !formData.about) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/portfolio/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/dashboard");
            } else {
                setError(data.message || "Failed to create portfolio");
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
            <div style={{ maxWidth: '800px', margin: '60px auto', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '30px', background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Create Your Portfolio</h1>
                {error && <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px' }}>✕ {error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Your Full Name"
                            className="input-field"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Role/Title *</label>
                        <input
                            type="text"
                            name="role"
                            placeholder="e.g., Full Stack Developer"
                            className="input-field"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>About You *</label>
                        <textarea
                            name="about"
                            placeholder="Write About Yourself"
                            className="input-field"
                            style={{ height: '120px', resize: 'vertical' }}
                            value={formData.about}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Skills</label>
                        <input
                            type="text"
                            name="skills"
                            placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                            className="input-field"
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Your phone number"
                                className="input-field"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="City, Country"
                            className="input-field"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>GitHub Link</label>
                        <input
                            type="url"
                            name="githubLink"
                            placeholder="https://github.com/yourname"
                            className="input-field"
                            value={formData.githubLink}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="submit-btn" type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                        {loading ? "Saving..." : "Save Portfolio"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePortfolio;