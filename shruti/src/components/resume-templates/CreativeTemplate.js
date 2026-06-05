const styles = {
  page: {
    fontFamily: "'Barlow', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a1a",
    background: "#fff",
    maxWidth: 800,
    margin: "0 auto",
    lineHeight: 1.5,
    fontSize: 11,
  },
  header: {
    background: "linear-gradient(135deg, #424A52, #5C6770)",
    color: "#fff",
    padding: "44px 40px 36px",
  },
  name: { fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" },
  role: { fontSize: 14, color: "#BEC8D1", fontWeight: 600, margin: "6px 0 12px" },
  contactLine: { display: "flex", gap: 18, flexWrap: "wrap", fontSize: 11, color: "#D0D7DE" },
  body: { padding: "28px 40px" },
  card: {
    background: "#F7F9FB",
    border: "1px solid #E8EEF3",
    borderRadius: 8,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#5C6770", margin: "0 0 10px", letterSpacing: "1px" },
  summary: { fontSize: 12, color: "#333", lineHeight: 1.6, margin: 0 },
  skillsWrap: { display: "flex", flexWrap: "wrap", gap: 6 },
  skill: { fontSize: 11, padding: "3px 12px", background: "#fff", border: "1px solid #D0D7DE", borderRadius: 6, color: "#424A52", fontWeight: 600 },
  entry: { marginBottom: 12 },
  entryTitle: { fontSize: 13, fontWeight: 700, margin: 0 },
  entrySub: { fontSize: 11, color: "#5C6770", margin: "2px 0 0" },
  entryDate: { fontSize: 10, color: "#8C97A2", fontWeight: 600, margin: "2px 0 0" },
  entryDesc: { fontSize: 11, color: "#333", margin: "4px 0 0", lineHeight: 1.5 },
};

function Card({ title, children }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      {children}
    </div>
  );
}

function CreativeTemplate({ data }) {
  const skills = parseList(data.skills);
  const experience = parseEntries(data.experience);
  const education = parseEntries(data.education);
  const projects = parseEntries(data.projects);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.name}>{data.fullName || "Your Name"}</h1>
        <p style={styles.role}>{data.role || "Professional Role"}</p>
        <div style={styles.contactLine}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      <div style={styles.body}>
        {data.summary && (
          <Card title="About">
            <p style={styles.summary}>{data.summary}</p>
          </Card>
        )}

        {skills.length > 0 && (
          <Card title="Skills">
            <div style={styles.skillsWrap}>
              {skills.map((s, i) => <span key={i} style={styles.skill}>{s}</span>)}
            </div>
          </Card>
        )}

        {experience.length > 0 && (
          <Card title="Experience">
            {experience.map((e, i) => (
              <div key={i} style={{ ...styles.entry, paddingBottom: i < experience.length - 1 ? 12 : 0, borderBottom: i < experience.length - 1 ? "1px solid #E8EEF3" : "none" }}>
                <h4 style={styles.entryTitle}>{e.role || e.title}</h4>
                {e.company && <p style={styles.entrySub}>{e.company}</p>}
                {(e.startDate || e.endDate) && (
                  <p style={styles.entryDate}>{e.startDate || ""}{e.startDate && e.endDate ? " – " : ""}{e.endDate || ""}</p>
                )}
                {e.description && <p style={styles.entryDesc}>{e.description}</p>}
              </div>
            ))}
          </Card>
        )}

        {education.length > 0 && (
          <Card title="Education">
            {education.map((e, i) => (
              <div key={i} style={styles.entry}>
                <h4 style={styles.entryTitle}>{e.degree || ""}{e.degree && e.field ? " in " : ""}{e.field || ""}</h4>
                {e.institution && <p style={styles.entrySub}>{e.institution}</p>}
                {(e.startDate || e.endDate) && (
                  <p style={styles.entryDate}>{e.startDate || ""}{e.startDate && e.endDate ? " – " : ""}{e.endDate || ""}</p>
                )}
              </div>
            ))}
          </Card>
        )}

        {projects.length > 0 && (
          <Card title="Projects">
            {projects.map((p, i) => (
              <div key={i} style={{ ...styles.entry, paddingBottom: i < projects.length - 1 ? 12 : 0, borderBottom: i < projects.length - 1 ? "1px solid #E8EEF3" : "none" }}>
                <h4 style={styles.entryTitle}>{p.name || p.title}</h4>
                {p.description && <p style={styles.entryDesc}>{p.description}</p>}
                {p.technologies && <p style={{ ...styles.entrySub, marginTop: 2 }}>Tech: {p.technologies}</p>}
              </div>
            ))}
          </Card>
        )}

        {data.links && (
          <Card title="Links">
            <p style={{ fontSize: 11, color: "#5C6770", margin: 0 }}>{data.links}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseEntries(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return []; }
}

export default CreativeTemplate;
