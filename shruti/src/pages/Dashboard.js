import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [portfolio, setPortfolio] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const portfolioRes = await fetch("http://localhost:5000/api/portfolio/get", {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                const projectsRes = await fetch("http://localhost:5000/api/projects/get", {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                if (portfolioRes.ok) {
                    setPortfolio(await portfolioRes.json());
                }
                if (projectsRes.ok) {
                    setProjects(await projectsRes.json());
                }
            } catch (err) {
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                {error && <div style={{ color: '#ef4444', marginBottom: '20px' }}>✕ {error}</div>}

                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '36px', marginBottom: '20px', background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dashboard</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="card">
                        <h2 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>Total Projects</h2>
                        <h3 style={{ fontSize: '32px', color: '#4f46e5', fontWeight: 'bold' }}>{projects.length}</h3>
                    </div>
                    <div className="card">
                        <h2 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>Portfolio Status</h2>
                        <h3 style={{ fontSize: '32px', color: '#7e22ce', fontWeight: 'bold' }}>{portfolio ? "✓ Created" : "pending"}</h3>
                    </div>
                    <div className="card">
                        <h2 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>Completion</h2>
                        <h3 style={{ fontSize: '32px', color: '#06b6d4', fontWeight: 'bold' }}>{portfolio && projects.length > 0 ? "100%" : "50%"}</h3>
                    </div>
                </div>

                {!portfolio && (
                    <button 
                        onClick={() => navigate("/create")}
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 30px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '30px',
                        }}
                    >
                        Create Portfolio
                    </button>
                )}

                {portfolio && (
                    <div className="card" style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Portfolio Information</h2>
                        <p><strong>Name:</strong> {portfolio.fullName}</p>
                        <p><strong>Role:</strong> {portfolio.role}</p>
                        <p><strong>About:</strong> {portfolio.about}</p>
                        <p><strong>Skills:</strong> {portfolio.skills}</p>
                    </div>
                )}

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '24px' }}>Your Projects</h2>
                        <button 
                            onClick={() => navigate("/project")}
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            + Add Project
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <p style={{ color: '#cbd5e1' }}>No projects added yet. Click "Add Project" to get started.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {projects.map((project) => (
                                <div key={project._id} className="card">
                                    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{project.title}</h3>
                                    <p style={{ marginBottom: '10px', color: '#cbd5e1' }}>{project.description}</p>
                                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px' }}>
                                        <strong>Technologies:</strong> {project.technologies}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {project.githubLink && (
                                            <a 
                                                href={project.githubLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '14px' }}
                                            >
                                                GitHub
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a 
                                                href={project.liveLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ color: '#7e22ce', textDecoration: 'none', fontSize: '14px' }}
                                            >
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Dashboard;