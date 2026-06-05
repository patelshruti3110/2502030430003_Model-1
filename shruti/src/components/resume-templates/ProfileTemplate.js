const styles = {
  page: {
    fontFamily: "'Barlow', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a1a",
    background: "#fff",
    maxWidth: 800,
    margin: "0 auto",
    lineHeight: 1.45,
    fontSize: 12,
    display: "flex",
    minHeight: 900,
  },
  sidebar: {
    width: "34%",
    background: "#2C353D",
    color: "#E8EEF3",
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sidebarName: { fontSize: 20, fontWeight: 800, margin: 0, color: "#fff" },
  sidebarRole: { fontSize: 12, fontWeight: 600, margin: "4px 0 0", color: "#BEC8D1" },
  sidebarDivider: { height: 1, background: "rgba(255,255,255,0.15)", margin: "12px 0" },
  sidebarLabel: { fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#A6B7C7", margin: "0 0 6px", letterSpacing: "1px" },
  sidebarText: { fontSize: 11, margin: "2px 0", color: "#D0D7DE" },
  sidebarSkill: { fontSize: 10, padding: "2px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 999, color: "#D0D7DE", fontWeight: 600, display: "inline-block", margin: "2px 4px 2px 0" },
  main: {
    flex: 1,
    padding: "40px 32px",
  },
  sectionTitle: { fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "#2C353D", margin: "0 0 8px", letterSpacing: "0.5px", borderBottom: "2px solid #2C353D", paddingBottom: 4 },
  summary: { fontSize: 12, color: "#333", lineHeight: 1.5, margin: 0 },
  entry: { marginBottom: 14 },
  entryTitle: { fontSize: 13, fontWeight: 700, margin: 0 },
  entrySub: { fontSize: 11, color: "#5C6770", margin: "2px 0 0" },
  entryDate: { fontSize: 10, color: "#8C97A2", fontWeight: 600, margin: "2px 0 0" },
  entryDesc: { fontSize: 11, color: "#333", margin: "4px 0 0", lineHeight: 1.5 },
};

function Section({ title, children, style }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function ProfileTemplate({ data }) {
  const skills = parseList(data.skills);
  const experience = parseEntries(data.experience);
  const education = parseEntries(data.education);
  const projects = parseEntries(data.projects);

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div>
          <h1 style={styles.sidebarName}>{data.fullName || "Your Name"}</h1>
          <p style={styles.sidebarRole}>{data.role || "Professional Role"}</p>
        </div>

        <div style={styles.sidebarDivider} />

        <div>
          <p style={styles.sidebarLabel}>Contact</p>
          {data.email && <p style={styles.sidebarText}>{data.email}</p>}
          {data.phone && <p style={styles.sidebarText}>{data.phone}</p>}
          {data.location && <p style={styles.sidebarText}>{data.location}</p>}
        </div>

        {skills.length > 0 && (
          <>
            <div style={styles.sidebarDivider} />
            <div>
              <p style={styles.sidebarLabel}>Skills</p>
              <div>
                {skills.map((s, i) => <span key={i} style={styles.sidebarSkill}>{s}</span>)}
              </div>
            </div>
          </>
        )}

        {data.links && (
          <>
            <div style={styles.sidebarDivider} />
            <div>
              <p style={styles.sidebarLabel}>Links</p>
              <p style={styles.sidebarText}>{data.links}</p>
            </div>
          </>
        )}
      </div>

      <div style={styles.main}>
        {data.summary && (
          <Section title="About">
            <p style={styles.summary}>{data.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((e, i) => (
              <div key={i} style={styles.entry}>
                <h4 style={styles.entryTitle}>{e.role || e.title}</h4>
                {e.company && <p style={styles.entrySub}>{e.company}</p>}
                {e.institution && <p style={styles.entrySub}>{e.institution}</p>}
                {(e.startDate || e.endDate) && (
                  <p style={styles.entryDate}>{e.startDate || ""}{e.startDate && e.endDate ? " – " : ""}{e.endDate || ""}</p>
                )}
                {e.description && <p style={styles.entryDesc}>{e.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((e, i) => (
              <div key={i} style={styles.entry}>
                <h4 style={styles.entryTitle}>{e.degree || ""}{e.degree && e.field ? " in " : ""}{e.field || ""}</h4>
                {e.institution && <p style={styles.entrySub}>{e.institution}</p>}
                {(e.startDate || e.endDate) && (
                  <p style={styles.entryDate}>{e.startDate || ""}{e.startDate && e.endDate ? " – " : ""}{e.endDate || ""}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p, i) => (
              <div key={i} style={styles.entry}>
                <h4 style={styles.entryTitle}>{p.name || p.title}</h4>
                {p.description && <p style={styles.entryDesc}>{p.description}</p>}
                {p.technologies && <p style={{ ...styles.entrySub, marginTop: 2 }}>Tech: {p.technologies}</p>}
              </div>
            ))}
          </Section>
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

export default ProfileTemplate;
