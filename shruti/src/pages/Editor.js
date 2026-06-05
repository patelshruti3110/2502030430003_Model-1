import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { templates } from "../components/TemplateGallery";
import { useToast } from "../context/ToastContext";
import { portfolioAPI, projectAPI, resumeAPI } from "../services/api";
import { validatePortfolio, validateProject, validateResume } from "../utils/validation";

function Editor() {
  const { type, id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isNew = id === "new";
  const [values, setValues] = useState(() => getInitialValues(type, state?.templateId));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const config = useMemo(() => getEditorConfig(type), [type]);

  useEffect(() => {
    setValues(getInitialValues(type, state?.templateId));
    setErrors({});
    setTouched({});
    setApiError("");
    setLoading(!isNew);
  }, [type, id, isNew, state?.templateId]);

  useEffect(() => {
    if (isNew || !config) return;

    async function loadRecord() {
      setLoading(true);
      try {
        let response;
        if (type === "project") response = await projectAPI.get(id);
        if (type === "portfolio") response = await portfolioAPI.get();
        if (type === "resume") response = await resumeAPI.get(id);
        setValues({ ...getInitialValues(type), ...(response?.data || {}) });
      } catch (error) {
        setApiError(error.response?.data?.message || "Unable to load this item.");
        addToast("Unable to load editor data.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadRecord();
  }, [addToast, config, id, isNew, type]);

  if (!config) {
    return (
      <div className="page page-narrow">
        <div className="empty-state">
          <h2>Editor not found</h2>
          <p>This editor type is not available.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const updateField = (event) => {
    const nextValues = { ...values, [event.target.name]: event.target.value };
    setValues(nextValues);

    if (touched[event.target.name]) {
      setErrors(config.validate(nextValues));
    }
  };

  const markTouched = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const handleSave = async () => {
    const nextErrors = config.validate(values);
    setErrors(nextErrors);
    setTouched(markAllTouched(values));
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      setApiError("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      const payload = trimValues(values);
      if (type === "project") {
        if (isNew) await projectAPI.create(payload);
        else await projectAPI.update(id, payload);
      }

      if (type === "portfolio") {
        await portfolioAPI.create(payload);
      }

      if (type === "resume") {
        if (isNew) await resumeAPI.create(payload);
        else await resumeAPI.update(id, payload);
      }

      addToast(`${config.singular} saved successfully.`, "success");
      navigate(config.afterSave);
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to save. Please try again.");
      addToast("Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page page-narrow">
        <div className="loader">
          <span className="spinner" />
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <p className="page-kicker">{config.kicker}</p>
          <h1 className="page-title">{isNew ? `New ${config.singular}` : `Edit ${config.singular}`}</h1>
          <p className="page-subtitle">{config.subtitle}</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => navigate(config.afterSave)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {apiError && <div className="alert" role="alert">{apiError}</div>}

      <section className="panel form-card">
        {type === "project" && (
          <ProjectForm values={values} errors={errors} touched={touched} onChange={updateField} onBlur={markTouched} />
        )}
        {type === "portfolio" && (
          <PortfolioForm values={values} errors={errors} touched={touched} onChange={updateField} onBlur={markTouched} />
        )}
        {type === "resume" && (
          <ResumeForm values={values} errors={errors} touched={touched} onChange={updateField} onBlur={markTouched} />
        )}
      </section>
    </div>
  );
}

function ProjectForm({ values, errors, touched, onChange, onBlur }) {
  return (
    <div className="form-grid">
      <FormField label="Project Title" name="title" value={values.title} onChange={onChange} onBlur={onBlur} error={touched.title && errors.title} placeholder="Portfolio Builder" full />
      <FormField label="Description" name="description" value={values.description} onChange={onChange} onBlur={onBlur} error={touched.description && errors.description} placeholder="Describe the problem, solution, and impact." textarea full rows={5} />
      <FormField label="Technologies" name="technologies" value={values.technologies} onChange={onChange} onBlur={onBlur} placeholder="React, Express, MongoDB" full />
      <FormField label="Image URL" name="imageUrl" value={values.imageUrl} onChange={onChange} onBlur={onBlur} error={touched.imageUrl && errors.imageUrl} placeholder="https://example.com/project.png" full />
      <FormField label="GitHub Link" name="githubLink" value={values.githubLink} onChange={onChange} onBlur={onBlur} error={touched.githubLink && errors.githubLink} placeholder="https://github.com/..." />
      <FormField label="Live Demo Link" name="liveLink" value={values.liveLink} onChange={onChange} onBlur={onBlur} error={touched.liveLink && errors.liveLink} placeholder="https://example.com" />
    </div>
  );
}

function PortfolioForm({ values, errors, touched, onChange, onBlur }) {
  return (
    <div className="form-grid">
      <FormField label="Full Name" name="fullName" value={values.fullName} onChange={onChange} onBlur={onBlur} error={touched.fullName && errors.fullName} placeholder="Shruti Patel" />
      <FormField label="Role" name="role" value={values.role} onChange={onChange} onBlur={onBlur} error={touched.role && errors.role} placeholder="Full Stack Developer" />
      <FormField label="About You" name="about" value={values.about} onChange={onChange} onBlur={onBlur} error={touched.about && errors.about} placeholder="Write a short professional introduction." textarea full rows={5} />
      <FormField label="Skills" name="skills" value={values.skills} onChange={onChange} onBlur={onBlur} placeholder="React, Node.js, MongoDB" full />
      <FormField label="Email" name="email" type="email" value={values.email} onChange={onChange} onBlur={onBlur} error={touched.email && errors.email} placeholder="you@example.com" />
      <FormField label="Phone" name="phone" value={values.phone} onChange={onChange} onBlur={onBlur} placeholder="+91 98765 43210" />
      <FormField label="Location" name="location" value={values.location} onChange={onChange} onBlur={onBlur} placeholder="Ahmedabad, India" />
      <FormField label="GitHub Link" name="githubLink" value={values.githubLink} onChange={onChange} onBlur={onBlur} error={touched.githubLink && errors.githubLink} placeholder="https://github.com/username" />
      <FormField label="LinkedIn Link" name="linkedinLink" value={values.linkedinLink} onChange={onChange} onBlur={onBlur} error={touched.linkedinLink && errors.linkedinLink} placeholder="https://linkedin.com/in/username" full />
    </div>
  );
}

function ResumeForm({ values, errors, touched, onChange, onBlur }) {
  const templateOptions = templates.map((template) => ({
    value: template.id,
    label: template.name,
  }));

  return (
    <div className="form-grid">
      <FormField label="Template" name="templateId" value={values.templateId} onChange={onChange} onBlur={onBlur} select options={templateOptions} />
      <FormField label="Resume Title" name="title" value={values.title} onChange={onChange} onBlur={onBlur} placeholder="Frontend Developer Resume" />
      <FormField label="Full Name" name="fullName" value={values.fullName} onChange={onChange} onBlur={onBlur} error={touched.fullName && errors.fullName} placeholder="Shruti Patel" />
      <FormField label="Role" name="role" value={values.role} onChange={onChange} onBlur={onBlur} error={touched.role && errors.role} placeholder="Frontend Developer" />
      <FormField label="Email" name="email" type="email" value={values.email} onChange={onChange} onBlur={onBlur} error={touched.email && errors.email} placeholder="you@example.com" />
      <FormField label="Phone" name="phone" value={values.phone} onChange={onChange} onBlur={onBlur} placeholder="+91 98765 43210" />
      <FormField label="Location" name="location" value={values.location} onChange={onChange} onBlur={onBlur} placeholder="Ahmedabad, India" full />
      <FormField label="Professional Summary" name="summary" value={values.summary} onChange={onChange} onBlur={onBlur} error={touched.summary && errors.summary} placeholder="Summarize your strengths, focus, and experience." textarea full rows={5} />
      <FormField label="Skills" name="skills" value={values.skills} onChange={onChange} onBlur={onBlur} placeholder="React, JavaScript, UI Design, REST APIs" textarea full rows={3} />
      <FormField label="Experience" name="experience" value={values.experience} onChange={onChange} onBlur={onBlur} placeholder="Company - Role - Impact" textarea full rows={5} />
      <FormField label="Education" name="education" value={values.education} onChange={onChange} onBlur={onBlur} placeholder="Degree, college, year" textarea full rows={4} />
      <FormField label="Projects" name="projects" value={values.projects} onChange={onChange} onBlur={onBlur} placeholder="Highlight resume-ready projects." textarea full rows={4} />
      <FormField label="Links" name="links" value={values.links} onChange={onChange} onBlur={onBlur} placeholder="GitHub, LinkedIn, portfolio URL" textarea full rows={3} />
    </div>
  );
}

function getEditorConfig(type) {
  const configs = {
    project: {
      singular: "Project",
      kicker: "Project manager",
      subtitle: "Document your work with links, stack details, and outcomes.",
      validate: validateProject,
      afterSave: "/my-projects",
    },
    portfolio: {
      singular: "Portfolio",
      kicker: "Portfolio profile",
      subtitle: "Create the public profile content shown in your preview.",
      validate: validatePortfolio,
      afterSave: "/dashboard",
    },
    resume: {
      singular: "Resume",
      kicker: "Resume builder",
      subtitle: "Save a resume version from your selected template.",
      validate: validateResume,
      afterSave: "/my-resumes",
    },
  };

  return configs[type];
}

function getInitialValues(type, templateId = "minimal") {
  if (type === "project") {
    return { title: "", description: "", technologies: "", githubLink: "", liveLink: "", imageUrl: "" };
  }

  if (type === "portfolio") {
    return {
      fullName: "",
      role: "",
      about: "",
      skills: "",
      email: "",
      phone: "",
      location: "",
      githubLink: "",
      linkedinLink: "",
    };
  }

  if (type === "resume") {
    return {
      templateId,
      title: "",
      fullName: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: "",
      experience: "",
      education: "",
      projects: "",
      links: "",
    };
  }

  return {};
}

function trimValues(values) {
  return Object.entries(values).reduce((payload, [key, value]) => {
    payload[key] = typeof value === "string" ? value.trim() : value;
    return payload;
  }, {});
}

function markAllTouched(values) {
  return Object.keys(values).reduce((current, key) => ({ ...current, [key]: true }), {});
}

export default Editor;
