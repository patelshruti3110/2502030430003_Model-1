const styles = {
  page: {
    fontFamily: "'Barlow', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a1a",
    background: "#fff",
    maxWidth: 900,
    margin: "0 auto",
    lineHeight: 1.55,
    fontSize: 14,
  },
  hero: {
    padding: "60px 40px",
    background: "linear-gradient(135deg, #424A52, #5C6770)",
    color: "#fff",
  },
  heroInner: { maxWidth: 780, margin: "0 auto" },
  name: { fontSize: 38, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" },
  role: { fontSize: 20, fontWeight: 600, margin: "8px 0 16px", color: "#BEC8D1" },
  about: { fontSize: 15, color: "rgba(255,255,255,0.84)", lineHeight: 1.6, margin: 0, maxWidth: 680 },
  contactRow: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 },
  chipLight: {
    fontSize: 12, padding: "4px 14px", borderRadius: 999,
    background: "rgba(255,255,255,0.12)", color: "#E8EEF3",
    fontWeight: 600, display: "inline-block",
  },
  linkChip: {
    fontSize: 12, padding: "4px 14px", borderRadius: 999,
    background: "rgba(255,255,255,0.12)", color: "#A6B7C7",
    fontWeight: 600, display: "inline-block",
    textDecoration: "none",
  },
  section: { padding: "36px 40px" },
  sectionInner: { maxWidth: 780, margin: "0 auto" },
  sectionTitle: { fontSize: 18, fontWeight: 800, color: "#424A52", margin: 0 },
  divider: { height: 1, background: "#E8EEF3", margin: "8px 0 20px" },
  skillsWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  skill: {
    fontSize: 12, padding: "5px 16px", borderRadius: 999,
    background: "#E8EEF3", color: "#424A52", fontWeight: 700,
  },
  projectCard: {
    border: "1px solid #E8EEF3",
    borderRadius: 8,
    padding: 20,
    background: "#F7F9FB",
    marginBottom: 16,
  },
  projectTitle: { fontSize: 17, fontWeight: 800, margin: "0 0 6px", color: "#424A52" },
  projectDesc: { fontSize: 14, color: "#5C6770", margin: "0 0 10px", lineHeight: 1.5 },
  projectTech: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 },
  techChip: {
    fontSize: 11, padding: "3px 10px", borderRadius: 999,
    background: "#fff", border: "1px solid #D0D7DE",
    color: "#5C6770", fontWeight: 600,
  },
  actionRow: { display: "flex", gap: 8, marginTop: 12 },
  btnLink: {
    fontSize: 12, padding: "7px 16px", borderRadius: 6,
    fontWeight: 700, cursor: "pointer", textDecoration: "none",
    display: "inline-block",
  },
};

function PortfolioPreview({ data, projects = [] }) {
  const skills = parseList(data?.skills);
  const hasContact = data?.email || data?.phone || data?.location;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#A6B7C7", margin: "0 0 10px", letterSpacing: "0.5px" }}>
            Portfolio
          </p>
          <h1 style={styles.name}>{data?.fullName || "Your Name"}</h1>
          <p style={styles.role}>{data?.role || "Professional Role"}</p>
          {data?.about && <p style={styles.about}>{data.about}</p>}
          {hasContact && (
            <div style={styles.contactRow}>
              {data.email && <span style={styles.chipLight}>{data.email}</span>}
              {data.phone && <span style={styles.chipLight}>{data.phone}</span>}
              {data.location && <span style={styles.chipLight}>{data.location}</span>}
            </div>
          )}
          {(data?.githubLink || data?.linkedinLink) && (
            <div style={{ ...styles.contactRow, gap: 10 }}>
              {data.githubLink && (
                <a href={data.githubLink} target="_blank" rel="noopener noreferrer" style={styles.linkChip}>
                  GitHub
                </a>
              )}
              {data.linkedinLink && (
                <a href={data.linkedinLink} target="_blank" rel="noopener noreferrer" style={styles.linkChip}>
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div style={styles.divider} />
            <div style={styles.skillsWrap}>
              {skills.map((s, i) => <span key={i} style={styles.skill}>{s}</span>)}
            </div>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ ...styles.section, paddingTop: 0 }}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>Projects</h2>
            <div style={styles.divider} />
            {projects.map((p, i) => (
              <div key={p._id || i} style={styles.projectCard}>
                <h3 style={styles.projectTitle}>{p.title}</h3>
                <p style={styles.projectDesc}>{p.description}</p>
                {p.technologies && (
                  <div style={styles.projectTech}>
                    {p.technologies.split(",").map((t, j) => (
                      <span key={j} style={styles.techChip}>{t.trim()}</span>
                    ))}
                  </div>
                )}
                {(p.githubLink || p.liveLink) && (
                  <div style={styles.actionRow}>
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
                        style={{ ...styles.btnLink, background: "#E8EEF3", color: "#424A52" }}>
                        GitHub
                      </a>
                    )}
                    {p.liveLink && (
                      <a href={p.liveLink} target="_blank" rel="noopener noreferrer"
                        style={{ ...styles.btnLink, background: "#5C6770", color: "#fff" }}>
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!data?.fullName && projects.length === 0 && (
        <div style={{ padding: "60px 40px", textAlign: "center", color: "#8C97A2" }}>
          Fill in your details to see a live portfolio preview
        </div>
      )}
    </div>
  );
}

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export default PortfolioPreview;
