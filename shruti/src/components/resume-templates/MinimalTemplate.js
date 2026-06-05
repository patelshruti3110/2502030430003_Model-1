const styles = {
  page: {
    fontFamily: "'Barlow', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a1a",
    background: "#fff",
    padding: "48px 52px",
    maxWidth: 800,
    margin: "0 auto",
    lineHeight: 1.45,
    fontSize: 12,
  },
  header: { textAlign: "center", marginBottom: 20 },
  name: { fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" },
  role: { fontSize: 14, color: "#5C6770", margin: "4px 0 0", fontWeight: 600 },
  contact: { fontSize: 11, color: "#5C6770", marginTop: 8, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" },
  divider: { height: 1, background: "#D0D7DE", margin: "16px 0" },
  sectionTitle: { fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#5C6770", margin: "0 0 8px", letterSpacing: "0.5px" },
  summary: { fontSize: 12, color: "#333", lineHeight: 1.5, margin: 0 },
  skills: { display: "flex", flexWrap: "wrap", gap: 6 },
  skill: { fontSize: 11, padding: "2px 10px", background: "#E8EEF3", borderRadius: 999, color: "#424A52", fontWeight: 600 },
  entry: { marginBottom: 14 },
  entryHeader: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
  entryTitle: { fontSize: 13, fontWeight: 700, margin: 0 },
  entrySub: { fontSize: 12, color: "#5C6770", margin: "2px 0 0" },
  entryDate: { fontSize: 11, color: "#8C97A2", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 },
  entryDesc: { fontSize: 11, color: "#333", margin: "4px 0 0", lineHeight: 1.5 },
};

function Section({ title, children, style }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function MinimalTemplate({ data }) {
  const skills = parseList(data.skills);
  const experience = parseEntries(data.experience);
  const education = parseEntries(data.education);
  const projects = parseEntries(data.projects);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.name}>{data.fullName || "Your Name"}</h1>
        <p style={styles.role}>{data.role || "Professional Role"}</p>
        <div style={styles.contact}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>

      <div style={styles.divider} />

      {data.summary && (
        <Section title="Professional Summary">
          <p style={styles.summary}>{data.summary}</p>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={styles.skills}>
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
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <h4 style={styles.entryTitle}>{e.degree || ""}{e.degree && e.field ? " in " : ""}{e.field || ""}</h4>
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

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <h4 style={styles.entryTitle}>{p.name || p.title}</h4>
                {p.technologies && <span style={{ ...styles.entryDate, marginLeft: 12 }}>{p.technologies}</span>}
              </div>
              {p.description && <p style={styles.entryDesc}>{p.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {data.links && (
        <Section title="Links" style={{ marginBottom: 0 }}>
          <p style={{ fontSize: 11, color: "#5C6770", margin: 0 }}>{data.links}</p>
        </Section>
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

export default MinimalTemplate;
