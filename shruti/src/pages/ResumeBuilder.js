import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { resumeAPI } from "../services/api";
import Button from "../components/Button";
import ResumePreview from "../components/ResumePreview";
import { templates } from "../components/TemplateGallery";
import { exportPDF, exportDOCXAsHTML } from "../utils/export";

const emptyResume = {
  templateId: "minimal",
  title: "",
  fullName: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  links: "",
};

const emptyExp = { company: "", role: "", startDate: "", endDate: "", description: "" };
const emptyEdu = { institution: "", degree: "", field: "", startDate: "", endDate: "" };
const emptyProj = { name: "", description: "", technologies: "" };

function ResumeBuilder() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const previewRef = useRef(null);

  const [data, setData] = useState(emptyResume);
  const [templateId, setTemplateId] = useState(location.state?.templateId || "minimal");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState("");

  const isNew = id === "new";

  useEffect(() => {
    if (isNew) return;
    resumeAPI.get(id)
      .then((res) => {
        const d = res.data;
        setData(normalizeIn(d));
        setTemplateId(d.templateId || "minimal");
      })
      .catch(() => addToast("Failed to load resume.", "error"));
  }, [id, isNew, addToast]);

  const handleChange = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleArrayItem = useCallback((field, index, key, value) => {
    setData((prev) => {
      const arr = [...(prev[field] || [])];
      if (!arr[index]) return prev;
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  }, []);

  const addItem = useCallback((field, template) => {
    setData((prev) => ({ ...prev, [field]: [...(prev[field] || []), { ...template }] }));
  }, []);

  const removeItem = useCallback((field, index) => {
    setData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = normalizeOut(data, templateId);
      if (isNew) {
        await resumeAPI.create(payload);
        addToast("Resume created.", "success");
      } else {
        await resumeAPI.update(id, payload);
        addToast("Resume saved.", "success");
      }
      navigate("/my-resumes");
    } catch {
      addToast("Failed to save resume.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting("pdf");
    try {
      const el = previewRef.current.querySelector('[style*="max-width: 800px"]') || previewRef.current;
      await exportPDF(el, `${slug(data.fullName || "resume")}.pdf`);
      addToast("PDF downloaded.", "success");
    } catch {
      addToast("Failed to export PDF.", "error");
    } finally {
      setExporting("");
    }
  };

  const handleExportDOCX = async () => {
    setExporting("docx");
    try {
      const payload = normalizeOut(data, templateId);
      exportDOCXAsHTML(payload, `${slug(data.fullName || "resume")}.doc`);
      addToast("DOCX downloaded.", "success");
    } catch {
      addToast("Failed to export DOCX.", "error");
    } finally {
      setExporting("");
    }
  };

  return (
    <div className="builder-layout">
      <div className="builder-form">
        <div className="page-header">
          <div>
            <p className="page-kicker">Resume Builder</p>
            <h1 className="page-title">{isNew ? "New Resume" : "Edit Resume"}</h1>
          </div>
        </div>

        <Section label="Template">
          <select
            className="form-input"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </Section>

        <Section label="Title">
          <input className="form-input" placeholder="e.g. Software Engineer Resume 2026" value={data.title} onChange={(e) => handleChange("title", e.target.value)} />
        </Section>

        <Section label="Full Name">
          <input className="form-input" placeholder="Jane Doe" value={data.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
        </Section>

        <Section label="Role">
          <input className="form-input" placeholder="e.g. Full-Stack Developer" value={data.role} onChange={(e) => handleChange("role", e.target.value)} />
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

        <Section label="Professional Summary">
          <textarea className="form-textarea" rows={3} placeholder="Brief summary of your experience and goals..." value={data.summary} onChange={(e) => handleChange("summary", e.target.value)} />
        </Section>

        <Section label="Skills">
          <SkillsInput values={data.skills} onChange={(v) => handleChange("skills", v)} />
        </Section>

        <Section label="Experience" labelAction={<AddBtn onClick={() => addItem("experience", emptyExp)} />}>
          {data.experience.map((item, i) => (
            <ArrayCard key={i} index={i} onRemove={() => removeItem("experience", i)}>
              <div className="form-grid">
                <input className="form-input" placeholder="Company" value={item.company} onChange={(e) => handleArrayItem("experience", i, "company", e.target.value)} />
                <input className="form-input" placeholder="Role" value={item.role} onChange={(e) => handleArrayItem("experience", i, "role", e.target.value)} />
              </div>
              <div className="form-grid">
                <input className="form-input" placeholder="Start Date" value={item.startDate} onChange={(e) => handleArrayItem("experience", i, "startDate", e.target.value)} />
                <input className="form-input" placeholder="End Date" value={item.endDate} onChange={(e) => handleArrayItem("experience", i, "endDate", e.target.value)} />
              </div>
              <textarea className="form-textarea" rows={2} placeholder="Describe your responsibilities and achievements" value={item.description} onChange={(e) => handleArrayItem("experience", i, "description", e.target.value)} />
            </ArrayCard>
          ))}
        </Section>

        <Section label="Education" labelAction={<AddBtn onClick={() => addItem("education", emptyEdu)} />}>
          {data.education.map((item, i) => (
            <ArrayCard key={i} index={i} onRemove={() => removeItem("education", i)}>
              <input className="form-input" placeholder="Institution" value={item.institution} onChange={(e) => handleArrayItem("education", i, "institution", e.target.value)} />
              <div className="form-grid">
                <input className="form-input" placeholder="Degree (e.g. B.S.)" value={item.degree} onChange={(e) => handleArrayItem("education", i, "degree", e.target.value)} />
                <input className="form-input" placeholder="Field (e.g. Computer Science)" value={item.field} onChange={(e) => handleArrayItem("education", i, "field", e.target.value)} />
              </div>
              <div className="form-grid">
                <input className="form-input" placeholder="Start Date" value={item.startDate} onChange={(e) => handleArrayItem("education", i, "startDate", e.target.value)} />
                <input className="form-input" placeholder="End Date" value={item.endDate} onChange={(e) => handleArrayItem("education", i, "endDate", e.target.value)} />
              </div>
            </ArrayCard>
          ))}
        </Section>

        <Section label="Projects" labelAction={<AddBtn onClick={() => addItem("projects", emptyProj)} />}>
          {data.projects.map((item, i) => (
            <ArrayCard key={i} index={i} onRemove={() => removeItem("projects", i)}>
              <input className="form-input" placeholder="Project Name" value={item.name} onChange={(e) => handleArrayItem("projects", i, "name", e.target.value)} />
              <textarea className="form-textarea" rows={2} placeholder="Description" value={item.description} onChange={(e) => handleArrayItem("projects", i, "description", e.target.value)} />
              <input className="form-input" placeholder="Technologies (comma separated)" value={item.technologies} onChange={(e) => handleArrayItem("projects", i, "technologies", e.target.value)} />
            </ArrayCard>
          ))}
        </Section>

        <Section label="Links">
          <input className="form-input" placeholder="Portfolio, GitHub, LinkedIn URLs" value={data.links} onChange={(e) => handleChange("links", e.target.value)} />
        </Section>

        <div className="builder-actions">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Resume"}</Button>
          <Button variant="secondary" onClick={() => navigate("/my-resumes")}>Cancel</Button>
        </div>
      </div>

      <div className="builder-preview" ref={previewRef}>
        <div className="builder-preview__toolbar">
          <h3 className="builder-preview__title">Preview</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" onClick={handleExportPDF} disabled={exporting === "pdf"}>
              {exporting === "pdf" ? "..." : "PDF"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportDOCX} disabled={exporting === "docx"}>
              {exporting === "docx" ? "..." : "DOC"}
            </Button>
          </div>
        </div>
        <div className="builder-preview__scroll">
          <ResumePreview data={data} templateId={templateId} />
        </div>
      </div>
    </div>
  );
}

function Section({ label, labelAction, children }) {
  return (
    <div className="form-field" style={{ marginBottom: 20, gridColumn: "1 / -1" }}>
      <div className="section-row">
        <label className="form-label">{label}</label>
        {labelAction}
      </div>
      {children}
    </div>
  );
}

function AddBtn({ onClick }) {
  return (
    <button className="add-btn" onClick={onClick} type="button">+ Add</button>
  );
}

function ArrayCard({ index, onRemove, children }) {
  return (
    <div className="array-card">
      <div className="array-card__head">
        <span className="array-card__index">#{index + 1}</span>
        <button className="array-card__remove" onClick={onRemove} type="button">Remove</button>
      </div>
      <div className="array-card__body">{children}</div>
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

function normalizeIn(d) {
  return {
    ...emptyResume,
    ...d,
    skills: parseArr(d.skills),
    experience: parseObjArr(d.experience),
    education: parseObjArr(d.education),
    projects: parseObjArr(d.projects),
  };
}

function normalizeOut(d, templateId) {
  const skills = Array.isArray(d.skills) ? d.skills : [];
  const experience = Array.isArray(d.experience) ? d.experience : [];
  const education = Array.isArray(d.education) ? d.education : [];
  const projects = Array.isArray(d.projects) ? d.projects : [];

  return {
    ...d,
    templateId,
    skills: JSON.stringify(skills),
    experience: JSON.stringify(experience),
    education: JSON.stringify(education),
    projects: JSON.stringify(projects),
  };
}

function parseArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : val.split(",").map((s) => s.trim()).filter(Boolean); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
}

function parseObjArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
}

function slug(str) {
  return (str || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resume";
}

export default ResumeBuilder;
