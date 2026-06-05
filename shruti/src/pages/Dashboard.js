import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";
import TemplateGallery from "../components/TemplateGallery";
import { portfolioAPI, projectAPI } from "../services/api";

function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [pRes, prRes] = await Promise.allSettled([
          portfolioAPI.get(),
          projectAPI.list(),
        ]);
        if (pRes.status === "fulfilled") setPortfolio(pRes.value.data);
        if (prRes.status === "fulfilled") setProjects(prRes.value.data);
      } catch {
        addToast("Failed to load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [addToast]);

  const filtered = projects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.technologies || "").toLowerCase().includes(q) ||
      (p.githubLink || "").toLowerCase().includes(q)
    );
  });

  const skillCount = portfolio?.skills
    ? portfolio.skills.split(",").filter(Boolean).length
    : 0;

  if (loading) {
    return (
      <div className="page">
        <div className="list-stack">
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Quick Action Cards */}
      <div className="action-grid" style={{ marginTop: "var(--space-4)" }}>
        <ActionCard
          icon={GitHubCardIcon}
          title="Import GitHub"
          text="Connect GitHub · Fetch Repositories"
          onClick={() => navigate("/github-import")}
        />
        <ActionCard
          icon={PlusCardIcon}
          title="Add Project"
          text="Manual Project Entry"
          onClick={() => navigate("/editor/project/new")}
        />
        <ActionCard
          icon={EyeCardIcon}
          title="Preview Portfolio"
          text="Open Live Preview"
          onClick={() => navigate("/preview")}
        />
        <ActionCard
          icon={ResumeCardIcon}
          title="My Resumes"
          text="View & Manage Resumes"
          onClick={() => navigate("/my-resumes")}
        />
      </div>

      {/* Statistics */}
      <div className="metric-grid">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Skills" value={skillCount} />
        <StatCard label="Templates" value={portfolio?.theme || "Modern Dark"} />
        <StatCard label="Completion" value={portfolio ? `${Math.min(85 + projects.length * 5, 100)}%` : "0%"} />
      </div>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-section__bar">
          <input
            type="text"
            className="form-input search-section__input"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") setSearch(""); }}
          />
          <Button size="sm" onClick={() => setSearch("")}>
            {search ? "Clear" : "Search"}
          </Button>
        </div>
        <p className="search-section__hint">
          Search by: Project Name · Description · Technology · GitHub Repository
        </p>
      </section>

      {/* Project Cards Grid */}
      <section style={{ marginBottom: "var(--space-8)" }}>
        <div className="toolbar">
          <h2 className="section-heading">Projects</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/editor/project/new")}>
            + Add Project
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h2>{search ? "No matches found" : "No projects yet"}</h2>
            <p>
              {search
                ? `No projects match "${search}". Try a different search term.`
                : "Add your first project to showcase your work."}
            </p>
            {!search && (
              <Button onClick={() => navigate("/editor/project/new")} style={{ marginTop: 16 }}>
                Add Project
              </Button>
            )}
          </div>
        ) : (
          <div className="project-grid">
            {filtered.map((project) => (
              <article key={project._id} className="project-card fade-in">
                <div className="project-card__thumb">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} />
                  ) : (
                    <span className="project-card__placeholder">{project.title?.[0] || "P"}</span>
                  )}
                </div>
                <div className="project-card__body">
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__text">{project.description}</p>
                  {project.technologies && (
                    <div className="list-card__meta">
                      {project.technologies.split(",").map((t, i) => (
                        <span key={i} className="chip">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-card__actions">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="button button--outline button--sm">
                        GitHub
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="button button--primary button--sm">
                        Live Demo
                      </a>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/editor/project/${project._id}`)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Template Gallery Section */}
      <section>
        <div className="toolbar">
          <div>
            <h2 className="section-heading">Template Gallery</h2>
            <p className="page-subtitle">Choose a template to create a professional resume</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/templates")}>View All</Button>
        </div>
        <TemplateGallery
          compact
          onSelect={(template) => navigate("/builder/new", { state: { templateId: template.id } })}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </article>
  );
}

function GitHubCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function PlusCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function EyeCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ResumeCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ActionCard({ icon: Icon, title, text, onClick }) {
  return (
    <button className="action-card" onClick={onClick}>
      <span className="action-card__icon">{Icon ? <Icon /> : null}</span>
      <h2 className="action-card__title">{title}</h2>
      <p className="action-card__text">{text}</p>
    </button>
  );
}

export default Dashboard;
