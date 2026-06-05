import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { portfolioAPI, projectAPI } from "../services/api";
import Button from "../components/Button";
import PortfolioPreview from "../components/PortfolioPreview";
import { exportPDF, exportDOCXAsHTML } from "../utils/export";

const emptyPortfolio = {
  fullName: "",
  role: "",
  about: "",
  skills: [],
  email: "",
  phone: "",
  location: "",
  githubLink: "",
  linkedinLink: "",
};

function PortfolioBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const previewRef = useRef(null);

  const [data, setData] = useState(emptyPortfolio);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState("");

  const isNew = id === "new";

  useEffect(() => {
    async function load() {
      try {
        const [pRes, prRes] = await Promise.allSettled([
          portfolioAPI.get(),
          projectAPI.list(),
        ]);
        if (pRes.status === "fulfilled") {
          const d = pRes.value.data;
          setData({
            ...emptyPortfolio,
            ...d,
            skills: parseArr(d.skills),
          });
        }
        if (prRes.status === "fulfilled" && prRes.value.data.length > 0) {
          setProjects(prRes.value.data);
        }
      } catch {
        addToast("Failed to load portfolio data.", "error");
      }
    }
    if (!isNew) load();
  }, [isNew, addToast]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
      };
      await portfolioAPI.create(payload);
      addToast("Portfolio saved.", "success");
      navigate("/my-portfolio");
    } catch {
      addToast("Failed to save portfolio.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting("pdf");
    try {
      await exportPDF(previewRef.current, `${slug(data.fullName || "portfolio")}.pdf`);
      addToast("PDF downloaded.", "success");
    } catch {
      addToast("Failed to export PDF.", "error");
    } finally {
      setExporting("");
    }
  };

  const handleExportDOC = async () => {
    setExporting("doc");
    try {
      const payload = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
      };
      exportDOCXAsHTML(payload, `${slug(data.fullName || "portfolio")}.doc`);
      addToast("DOC downloaded.", "success");
    } catch {
      addToast("Failed to export DOC.", "error");
    } finally {
      setExporting("");
    }
  };

  return (
    <div className="builder-layout">
      <div className="builder-form">
        <div className="page-header">
          <div>
            <p className="page-kicker">Portfolio Builder</p>
            <h1 className="page-title">{isNew ? "New Portfolio" : "Edit Portfolio"}</h1>
          </div>
        </div>

        <Section label="Full Name">
          <input className="form-input" placeholder="Jane Doe" value={data.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
        </Section>

        <Section label="Role">
          <input className="form-input" placeholder="e.g. Full-Stack Developer" value={data.role} onChange={(e) => handleChange("role", e.target.value)} />
        </Section>

        <Section label="About You">
          <textarea className="form-textarea" rows={4} placeholder="Write a short professional introduction..." value={data.about} onChange={(e) => handleChange("about", e.target.value)} />
        </Section>

        <Section label="Skills">
          <SkillsInput values={data.skills} onChange={(v) => handleChange("skills", v)} />
        </Section>

        <div className="form-grid">
          <Section label="Email">
            <input className="form-input" placeholder="jane@example.com" value={data.email} onChange={(e) => handleChange("email", e.target.value)} />
          </Section>
          <Section label="Phone">
            <input className="form-input" placeholder="+1 (555) 000-0000" value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </Section>
        </div>

        <Section label="Location">
          <input className="form-input" placeholder="City, State" value={data.location} onChange={(e) => handleChange("location", e.target.value)} />
        </Section>

        <div className="form-grid">
          <Section label="GitHub URL">
            <input className="form-input" placeholder="https://github.com/username" value={data.githubLink} onChange={(e) => handleChange("githubLink", e.target.value)} />
          </Section>
          <Section label="LinkedIn URL">
            <input className="form-input" placeholder="https://linkedin.com/in/username" value={data.linkedinLink} onChange={(e) => handleChange("linkedinLink", e.target.value)} />
          </Section>
        </div>

        <div className="builder-actions">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Portfolio"}</Button>
          <Button variant="secondary" onClick={() => navigate("/my-portfolio")}>Cancel</Button>
        </div>
      </div>

      <div className="builder-preview" ref={previewRef}>
        <div className="builder-preview__toolbar">
          <h3 className="builder-preview__title">Preview</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" onClick={handleExportPDF} disabled={exporting === "pdf"}>
              {exporting === "pdf" ? "..." : "PDF"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportDOC} disabled={exporting === "doc"}>
              {exporting === "doc" ? "..." : "DOC"}
            </Button>
          </div>
        </div>
        <div className="builder-preview__scroll">
          <PortfolioPreview data={data} projects={projects} />
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="form-field" style={{ marginBottom: 18, gridColumn: "1 / -1" }}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function SkillsInput({ values, onChange }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  };

  const remove = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          className="form-input"
          placeholder="Type a skill and press Add"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        />
        <button className="add-btn" onClick={add} type="button" style={{ height: 44 }}>Add</button>
      </div>
      <div className="list-card__meta">
        {values.map((s, i) => (
          <span key={i} className="chip" style={{ cursor: "pointer" }} onClick={() => remove(i)}>
            {s} &times;
          </span>
        ))}
      </div>
    </div>
  );
}

function parseArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : val.split(",").map((s) => s.trim()).filter(Boolean); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
}

function slug(str) {
  return (str || "portfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "portfolio";
}

export default PortfolioBuilder;
