import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import { templates } from "../components/TemplateGallery";
import { useToast } from "../context/ToastContext";
import { resumeAPI } from "../services/api";
import { downloadTextFile, resumeToText, toSafeFilename } from "../utils/download";

function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeAPI.list();
      setResumes(response.data);
    } catch {
      addToast("Failed to load resumes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await resumeAPI.delete(deleteTarget._id);
      setResumes((current) => current.filter((resume) => resume._id !== deleteTarget._id));
      addToast("Resume deleted.", "success");
    } catch {
      addToast("Failed to delete resume.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleDownload = (resume) => {
    downloadTextFile(`${toSafeFilename(resume.title || resume.fullName, "resume")}.txt`, resumeToText(resume));
    addToast("Resume downloaded.", "success");
  };

  if (loading) {
    return (
      <div className="page page-narrow">
        <div className="list-stack">
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <p className="page-kicker">Resume library</p>
          <h1 className="page-title">My Resumes</h1>
          <p className="page-subtitle">
            {resumes.length} resume{resumes.length === 1 ? "" : "s"} saved.
          </p>
        </div>
        <Button onClick={() => navigate("/templates")}>New Resume</Button>
      </div>

      {resumes.length === 0 ? (
        <div className="empty-state">
          <h2>No resumes yet</h2>
          <p>Pick a template and create a resume version for your applications.</p>
          <Button onClick={() => navigate("/templates")}>Browse Templates</Button>
        </div>
      ) : (
        <div className="list-stack">
          {resumes.map((resume) => (
            <article key={resume._id} className="list-card">
              <div className="list-card__top">
                <div>
                  <h2 className="list-card__title">{resume.title || `${resume.fullName} Resume`}</h2>
                  <p className="list-card__text">
                    {resume.role} - {getTemplateName(resume.templateId)} - Updated {formatDate(resume.updatedAt)}
                  </p>
                  {resume.skills && (
                    <div className="list-card__meta">
                      {parseSkills(resume.skills).slice(0, 6).map((skill) => (
                        <span key={skill} className="chip">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button size="sm" onClick={() => navigate(`/builder/${resume._id}`)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDownload(resume)}>
                    TXT
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteTarget(resume)}>
                    Remove
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete resume?"
        message={`This will permanently remove "${deleteTarget?.title || "this resume"}".`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function getTemplateName(templateId) {
  return templates.find((template) => template.id === templateId)?.name || "Minimal Slate";
}

function formatDate(value) {
  if (!value) return "today";
  return new Date(value).toLocaleDateString();
}

function parseSkills(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : val.split(",").map((s) => s.trim()).filter(Boolean); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
}

export default ResumeList;
