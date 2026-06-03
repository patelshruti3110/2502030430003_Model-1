import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProject() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveLink: "",
        imageUrl: "",
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

        if (!formData.title || !formData.description) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/projects/add", {
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
                setError(data.message || "Failed to add project");
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
                <h1 style={{ fontSize: '32px', marginBottom: '30px', background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Add New Project</h1>
                {error && <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px' }}>✕ {error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Project Title"
                            className="input-field"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Description *</label>
                        <textarea
                            name="description"
                            placeholder="Project Description"
                            className="input-field"
                            style={{ height: '120px', resize: 'vertical' }}
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Technologies Used</label>
                        <input
                            type="text"
                            name="technologies"
                            placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                            className="input-field"
                            value={formData.technologies}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            placeholder="https://example.com/image.jpg"
                            className="input-field"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>GitHub Link</label>
                            <input
                                type="url"
                                name="githubLink"
                                placeholder="https://github.com/..."
                                className="input-field"
                                value={formData.githubLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '14px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>Live Demo Link</label>
                            <input
                                type="url"
                                name="liveLink"
                                placeholder="https://example.com"
                                className="input-field"
                                value={formData.liveLink}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button className="submit-btn" type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                        {loading ? "Adding..." : "Add Project"}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default AddProject;