import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__inner">
          <div>
            <p className="home-hero__eyebrow">Developer portfolio workspace</p>
            <h1 className="home-hero__title">Portfolio Builder</h1>
            <p className="home-hero__copy">
              Create a professional portfolio, add project case studies, build resumes
              from templates, and preview the finished showcase in one clean workspace.
            </p>
            <div className="home-hero__actions">
              <Button size="lg" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}>
                {isAuthenticated ? "Open Dashboard" : "Start Building"}
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/preview")}>
                View Preview
              </Button>
            </div>
          </div>

          <div className="workspace-preview" aria-label="Portfolio Builder dashboard preview">
            <div className="workspace-preview__top">
              <strong>Portfolio Builder</strong>
              <span className="chip">Workspace</span>
            </div>
            <div className="workspace-preview__layout">
              <div className="workspace-preview__side">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="workspace-preview__main">
                <div className="workspace-preview__card">
                  <p className="page-kicker">Your library</p>
                  <h2 className="section-heading" style={{ marginBottom: 8 }}>Welcome back</h2>
                  <p className="panel-text">Manage portfolio details, projects, resumes, and preview.</p>
                </div>
                <div className="workspace-preview__tiles">
                  <span className="workspace-preview__tile" />
                  <span className="workspace-preview__tile" />
                  <span className="workspace-preview__tile" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="action-grid">
          {features.map((feature) => (
            <article key={feature.title} className="action-card">
              <span className="action-card__icon">{feature.short}</span>
              <h2 className="action-card__title">{feature.title}</h2>
              <p className="action-card__text">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

const features = [
  {
    short: "PF",
    title: "Portfolio editor",
    text: "Store your headline, bio, skills, contact links, and public profile details.",
  },
  {
    short: "PR",
    title: "Project manager",
    text: "Add, edit, delete, and download project summaries for your showcase.",
  },
  {
    short: "CV",
    title: "Resume templates",
    text: "Choose a polished template and save resume versions from the workspace.",
  },
  {
    short: "PV",
    title: "Live preview",
    text: "Review your finished portfolio page before sharing it as a project.",
  },
];

export default Home;
