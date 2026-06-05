import { useState } from "react";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";

function GitHubImport() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const { addToast } = useToast();

  const handleFetch = async () => {
    if (!username.trim()) {
      addToast("Please enter a GitHub username", "error");
      return;
    }
    setLoading(true);
    setFetched(false);
    try {
      const res = await fetch(`https://api.github.com/users/${username.trim()}/repos?per_page=12&sort=updated`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setRepos(data);
      setFetched(true);
      addToast(`Found ${data.length} repositories`, "success");
    } catch {
      addToast("Failed to fetch repositories. Check the username.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Integration</p>
          <h1 className="page-title">GitHub Import</h1>
          <p className="page-subtitle">Import your GitHub repositories to showcase in your portfolio.</p>
        </div>
      </div>

      <section className="panel" style={{ padding: 24, marginBottom: "var(--space-6)" }}>
        <h2 className="panel-title" style={{ marginBottom: 16 }}>Connect GitHub</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-field" style={{ flex: 1, minWidth: 240 }}>
            <label className="form-label">GitHub Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            />
          </div>
          <Button onClick={handleFetch} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Repositories"}
          </Button>
        </div>
      </section>

      {fetched && repos.length > 0 && (
        <section>
          <h2 className="section-heading">Repositories</h2>
          <div className="list-stack">
            {repos.map((repo) => (
              <article key={repo.id} className="list-card fade-in" style={{ padding: 18 }}>
                <div className="list-card__top">
                  <div>
                    <h3 className="list-card__title">{repo.name}</h3>
                    <p className="list-card__text" style={{ marginTop: 4 }}>
                      {repo.description || "No description"}
                    </p>
                    {repo.language && <span className="chip" style={{ marginTop: 8 }}>{repo.language}</span>}
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--primary button--sm"
                    style={{ textDecoration: "none" }}
                  >
                    Import
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {fetched && repos.length === 0 && (
        <div className="empty-state">
          <h2>No repositories found</h2>
          <p>This account has no public repositories.</p>
        </div>
      )}
    </div>
  );
}

export default GitHubImport;
