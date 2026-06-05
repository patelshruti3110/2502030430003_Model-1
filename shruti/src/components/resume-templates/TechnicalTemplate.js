const styles = {
  page: {
    fontFamily: "'Barlow', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a1a",
    background: "#fff",
    padding: "40px 44px",
    maxWidth: 800,
    margin: "0 auto",
    lineHeight: 1.5,
    fontSize: 11,
  },
  header: {
    borderBottom: "3px solid #2C353D",
    paddingBottom: 14,
    marginBottom: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  name: { fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" },
  role: { fontSize: 13, color: "#5C6770", fontWeight: 600, margin: "2px 0 0" },
  contactBlock: { textAlign: "right", fontSize: 10, color: "#5C6770", lineHeight: 1.6 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#fff",
    background: "#2C353D",
    padding: "4px 10px",
    margin: "0 0 10px",
    letterSpacing: "0.5px",
    display: "inline-block",
  },
  summary: { fontSize: 11, color: "#333", lineHeight: 1.5, margin: "0 0 16px" },
  skillsGrid: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 },
  skill: { fontSize: 10, padding: "2px 10px", background: "#E8EEF3", border: "1px solid #D0D7DE", borderRadius: 3, color: "#2C353D", fontWeight: 600 },
  entry: { marginBottom: 14, paddingLeft: 12, borderLeft: "2px solid #D0D7DE" },
  entryHeader: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
  entryTitle: { fontSize: 13, fontWeight: 700, margin: 0 },
  entrySub: { fontSize: 11, color: "#5C6770", margin: "1px 0 0" },
  entryDate: { fontSize: 10, color: "#8C97A2", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 },
  entryDesc: { fontSize: 11, color: "#333", margin: "4px 0 0", lineHeight: 1.5 },
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function TechnicalTemplate({ data }) {
  const skills = parseList(data.skills);
  const experience = parseEntries(data.experience);
  const education = parseEntries(data.education);
  const projects = parseEntries(data.projects);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.name}>{data.fullName || "Your Name"}</h1>
          <p style={styles.role}>{data.role || "Professional Role"}</p>
        </div>
        <div style={styles.contactBlock}>
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
        </div>
      </div>

      {data.summary && (
        <p style={styles.summary}>{data.summary}</p>
      )}

      {skills.length > 0 && (
        <Section title="Technical Skills">
          <div style={styles.skillsGrid}>
            {skills.map((s, i) => <span key={i} style={styles.skill}>{s}</span>)}
          </div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <h4 style={styles.entryTitle}>{e.role || e.title}</h4>
                  {e.company && <p style={styles.entrySub}>{e.company}</p>}
                  {e.institution && <p style={styles.entrySub}>{e.institution}</p>}
                </div>
                {(e.startDate || e.endDate) && (
                  <span style={styles.entryDate}>{e.startDate || ""}{e.startDate && e.endDate ? " – " : ""}{e.endDate || ""}</span>
                )}
              </div>
              {e.description && <p style={styles.entryDesc}>{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} style={{ ...styles.entry, borderLeftColor: "#BEC8D1" }}>
              <h4 style={styles.entryTitle}>{e.degree || ""}{e.degree && e.field ? " in " : ""}{e.field || ""}</h4>
              {e.institution && <p style={styles.entrySub}>{e.institution}</p>}
              {(e.startDate || e.endDate) && (
                <p style={{ ...styles.entryDate, marginLeft: 0, marginTop: 1 }}>{e.startDate || ""}{e.startDate && e.endDate ? " – " : ""}{e.endDate || ""}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ ...styles.entry, borderLeftColor: "#A6B7C7" }}>
              <h4 style={styles.entryTitle}>{p.name || p.title}</h4>
              {p.description && <p style={styles.entryDesc}>{p.description}</p>}
              {p.technologies && <p style={{ ...styles.entrySub, marginTop: 2 }}>Technologies: {p.technologies}</p>}
            </div>
          ))}
        </Section>
      )}

      {data.links && (
        <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid #D0D7DE" }}>
          <p style={{ fontSize: 10, color: "#5C6770", margin: 0 }}>{data.links}</p>
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

function parseEntries(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return []; }
}

export default TechnicalTemplate;
