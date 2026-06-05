import { useEffect, useState } from "react";
import { portfolioAPI, projectAPI } from "../services/api";

function Analytics() {
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, prRes] = await Promise.allSettled([
          portfolioAPI.get(),
          projectAPI.list(),
        ]);
        if (pRes.status === "fulfilled") setPortfolio(pRes.value.data);
        if (prRes.status === "fulfilled") setProjects(prRes.value.data);
      } catch { /* ignore */ } finally { setLoading(false); }
    }
    load();
  }, []);

  const skillCount = portfolio?.skills ? portfolio.skills.split(",").filter(Boolean).length : 0;
  const completion = portfolio ? Math.min(85 + projects.length * 5, 100) : 0;

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
          <p className="page-kicker">Insights</p>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Overview of your portfolio activity and progress.</p>
        </div>
      </div>

      <div className="metric-grid" style={{ marginBottom: "var(--space-6)" }}>
        <StatCard label="Total Projects" value={projects.length} />
        <StatCard label="Skills Listed" value={skillCount} />
        <StatCard label="Portfolio" value={portfolio ? "Active" : "Not Created"} />
        <StatCard label="Completion" value={`${completion}%`} />
      </div>

      <div className="panel" style={{ padding: 24 }}>
        <h2 className="panel-title" style={{ marginBottom: 12 }}>Portfolio Summary</h2>
        {portfolio ? (
          <>
            <p className="panel-text">Name: {portfolio.fullName}</p>
            <p className="panel-text">Role: {portfolio.role}</p>
            <p className="panel-text">Projects: {projects.length}</p>
            <p className="panel-text">Skills: {skillCount}</p>
            <div className="list-card__meta" style={{ marginTop: 12 }}>
              <span className="chip">Profile: {completion >= 100 ? "Complete" : `${completion}%`}</span>
              <span className="chip">Projects: {projects.length > 0 ? "Added" : "Empty"}</span>
            </div>
          </>
        ) : (
          <p className="panel-text">No portfolio data yet. Create your portfolio to see analytics.</p>
        )}
      </div>
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

export default Analytics;
