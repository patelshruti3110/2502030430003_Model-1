import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../context/ToastContext";
import { projectAPI } from "../services/api";
import { downloadTextFile, projectToText, toSafeFilename } from "../utils/download";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectAPI.list();
      setProjects(response.data);
    } catch {
      addToast("Failed to load projects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await projectAPI.delete(deleteTarget._id);
      setProjects((current) => current.filter((project) => project._id !== deleteTarget._id));
      addToast("Project deleted.", "success");
    } catch {
      addToast("Failed to delete project.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleDownload = (project) => {
    downloadTextFile(`${toSafeFilename(project.title, "project")}.txt`, projectToText(project));
    addToast("Project summary downloaded.", "success");
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
          <p className="page-kicker">Project library</p>
          <h1 className="page-title">My Projects</h1>
          <p className="page-subtitle">
            {projects.length} project{projects.length === 1 ? "" : "s"} saved.
          </p>
        </div>
        <Button onClick={() => navigate("/editor/project/new")}>Add Project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Add your first project to start building your portfolio showcase.</p>
          <Button onClick={() => navigate("/editor/project/new")}>Add Project</Button>
        </div>
      ) : (
        <div className="list-stack">
          {projects.map((project) => (
            <article key={project._id} className="list-card">
              <div className="list-card__top">
                <div>
                  <h2 className="list-card__title">{project.title}</h2>
                  <p className="list-card__text">{project.description}</p>
                  {project.technologies && (
                    <div className="list-card__meta">
                      {project.technologies.split(",").map((tech) => (
                        <span key={tech.trim()} className="chip">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button size="sm" onClick={() => navigate(`/editor/project/${project._id}`)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleDownload(project)}>
                    Download
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteTarget(project)}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="list-card__meta">
                {project.githubLink && (
                  <a className="button button--outline button--sm" href={project.githubLink} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
                {project.liveLink && (
                  <a className="button button--outline button--sm" href={project.liveLink} target="_blank" rel="noreferrer">
                    Live Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete project?"
        message={`This will permanently remove "${deleteTarget?.title || "this project"}".`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default ProjectList;
