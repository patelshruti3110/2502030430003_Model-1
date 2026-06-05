import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { portfolioAPI, projectAPI } from "../services/api";

const samplePortfolio = {
  fullName: "Your Name",
  role: "Full Stack Developer",
  about: "A polished portfolio preview will appear here after you create your profile and add projects.",
  skills: "React, Node.js, MongoDB, UI Design",
  email: "you@example.com",
  location: "Your city",
};

const sampleProjects = [
  {
    _id: "sample-1",
    title: "Portfolio Builder",
    description: "A full-stack workspace for building portfolios, project libraries, and resumes.",
    technologies: "React, Express, MongoDB",
  },
  {
    _id: "sample-2",
    title: "Resume Studio",
    description: "A resume editor with professional templates, validation, and downloadable content.",
    technologies: "React, CSS, REST API",
  },
];

function Preview() {
  const [portfolio, setPortfolio] = useState(samplePortfolio);
  const [projects, setProjects] = useState(sampleProjects);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setPortfolio(samplePortfolio);
      setProjects(sampleProjects);
      return;
    }

    async function fetchPreview() {
      setLoading(true);
      try {
        const [portfolioResult, projectsResult] = await Promise.allSettled([
          portfolioAPI.get(),
          projectAPI.list(),
        ]);

        if (portfolioResult.status === "fulfilled") {
          setPortfolio(portfolioResult.value.data);
        }

        if (projectsResult.status === "fulfilled" && projectsResult.value.data.length > 0) {
          setProjects(projectsResult.value.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, [isAuthenticated]);

  const skills = portfolio.skills
    ? portfolio.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  return (
    <div className="preview-page">
      <section className="portfolio-hero">
        <div className="portfolio-hero__inner">
          <p className="page-kicker" style={{ color: "var(--color-primary-soft)" }}>
            Portfolio preview
          </p>
          <h1>{portfolio.fullName}</h1>
          <p style={{ fontSize: 22, marginBottom: 10 }}>{portfolio.role}</p>
          <p>{portfolio.about}</p>
          <div className="list-card__meta" style={{ marginTop: 18 }}>
            {portfolio.email && <span className="chip">{portfolio.email}</span>}
            {portfolio.location && <span className="chip">{portfolio.location}</span>}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            {isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/portfolio-builder/edit")}>Edit Portfolio</Button>
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              </>
            ) : (
              <Button onClick={() => navigate("/signup")}>Create Your Portfolio</Button>
            )}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="portfolio-section">
          <div className="loader">
            <span className="spinner" />
            Loading preview...
          </div>
        </section>
      ) : (
        <>
          {skills.length > 0 && (
            <section className="portfolio-section">
              <h2 className="section-heading">Skills</h2>
              <div className="list-card__meta">
                {skills.map((skill) => (
                  <span key={skill} className="chip">{skill}</span>
                ))}
              </div>
            </section>
          )}

          <section className="portfolio-section">
            <div className="toolbar">
              <div>
                <h2 className="section-heading">Projects</h2>
                <p className="page-subtitle">Selected work from the project library.</p>
              </div>
              {isAuthenticated && (
                <Button variant="outline" onClick={() => navigate("/editor/project/new")}>
                  Add Project
                </Button>
              )}
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {projects.map((project) => (
                <article key={project._id} className="list-card">
                  <div className="template-preview" style={{ height: 140, marginBottom: 16 }}>
                    <span className="template-preview__hero" />
                    <span className="template-preview__line" />
                    <span className="template-preview__line short" />
                  </div>
                  <h3 className="list-card__title">{project.title}</h3>
                  <p className="list-card__text">{project.description}</p>
                  {project.technologies && (
                    <div className="list-card__meta">
                      {project.technologies.split(",").map((tech) => (
                        <span key={tech.trim()} className="chip">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="list-card__meta">
                    {project.githubLink && (
                      <a className="button button--outline button--sm" href={project.githubLink} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {project.liveLink && (
                      <a className="button button--outline button--sm" href={project.liveLink} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Preview;
