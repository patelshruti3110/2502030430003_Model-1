import { templateDisplayData } from "./resume-templates";
import TemplateCard from "./TemplateCard";

const templates = Object.entries(templateDisplayData).map(([id, data]) => ({
  id,
  ...data,
}));

function TemplateGallery({ onSelect, compact = false }) {
  return (
    <div className={`template-grid ${compact ? "template-grid--compact" : ""}`}>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onSelect={onSelect} />
      ))}
    </div>
  );
}

export { templates };
export default TemplateGallery;
