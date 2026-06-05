import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { portfolioAPI } from "../services/api";

function MyPortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    portfolioAPI.get()
      .then((res) => setPortfolio(res.data))
      .catch(() => setPortfolio(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="list-stack">
          <span className="skeleton" /><span className="skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Profile</p>
          <h1 className="page-title">My Portfolio</h1>
          <p className="page-subtitle">Manage your professional profile and details.</p>
        </div>
        <Button onClick={() => navigate(portfolio ? "/portfolio-builder/edit" : "/portfolio-builder/new")}>
          {portfolio ? "Edit Portfolio" : "Create Portfolio"}
        </Button>
      </div>

      {!portfolio ? (
        <div className="empty-state">
          <h2>No portfolio yet</h2>
          <p>Create your portfolio to showcase your skills, projects, and experience.</p>
          <Button onClick={() => navigate("/portfolio-builder/new")} style={{ marginTop: 16 }}>
            Create Portfolio
          </Button>
        </div>
      ) : (
        <div className="panel" style={{ padding: 24 }}>
          <div className="list-card__top" style={{ marginBottom: 16 }}>
            <div>
              <h2 className="panel-title">{portfolio.fullName}</h2>
              <p className="panel-text">{portfolio.role}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate("/portfolio-builder/edit")}>
              Edit
            </Button>
          </div>
          {portfolio.about && <p className="panel-text" style={{ marginBottom: 12 }}>{portfolio.about}</p>}
          {portfolio.email && <p className="panel-text" style={{ marginBottom: 4 }}>Email: {portfolio.email}</p>}
          {portfolio.phone && <p className="panel-text" style={{ marginBottom: 4 }}>Phone: {portfolio.phone}</p>}
          {portfolio.location && <p className="panel-text" style={{ marginBottom: 12 }}>Location: {portfolio.location}</p>}
          {portfolio.skills && (
            <div className="list-card__meta">
              {portfolio.skills.split(",").map((s, i) => (
                <span key={i} className="chip">{s.trim()}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyPortfolio;
