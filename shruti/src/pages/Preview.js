import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";

function Preview() {
    const [portfolio, setPortfolio] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
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
                    console.error("Failed to load preview data", err);
                }
            };
            fetchData();
        }
    }, []);

    return (
        <div>
            <Navbar />
            <section style={{ textAlign: 'center', padding: '60px 30px', background: 'linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)' }}>
                <h1 style={{ fontSize: '52px', marginBottom: '10px', fontWeight: '800' }}>
                    {portfolio?.fullName || "Your Name"}
                </h1>
                <p style={{ fontSize: '24px', marginBottom: '15px', opacity: '0.95' }}>
                    {portfolio?.role || "Developer"}
                </p>
                <p style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto', opacity: '0.9' }}>
                    {portfolio?.about || "Build your professional portfolio"}
                </p>
                {portfolio?.email && (
                    <p style={{ fontSize: '16px', marginTop: '15px' }}>
                        📧 {portfolio.email}
                    </p>
                )}
            </section>

            {portfolio?.skills && (
                <section style={{ padding: '60px 30px', background: '#0f172a' }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>Skills</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                        {portfolio.skills.split(',').map((skill, idx) => (
                            <div key={idx} style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: '1px solid rgba(79, 70, 229, 0.2)',
                            }}>
                                {skill.trim()}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section style={{ padding: '60px 30px' }}>
                <h2 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>Projects</h2>
                {projects.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No projects to display yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
                        {projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                image={project.imageUrl || "https://via.placeholder.com/400"}
                                title={project.title}
                                description={project.description}
                                github={project.githubLink || "#"}
                                demo={project.liveLink || "#"}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
export default Preview;