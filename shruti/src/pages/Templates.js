import { useNavigate } from "react-router-dom";
import TemplateGallery from "../components/TemplateGallery";
import { useToast } from "../context/ToastContext";

function Templates() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSelect = (template) => {
    addToast(`Selected ${template.name}.`, "info");
    navigate("/builder/new", { state: { templateId: template.id } });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Resume library</p>
          <h1 className="page-title">Templates</h1>
          <p className="page-subtitle">
            Choose a professional layout and customize every section in the editor.
          </p>
        </div>
      </div>
      <TemplateGallery onSelect={handleSelect} />
    </div>
  );
}

export default Templates;
