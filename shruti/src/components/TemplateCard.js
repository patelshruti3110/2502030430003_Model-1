import { sampleData, templateComponents } from "./resume-templates";
import Button from "./Button";

function TemplateCard({ template, onSelect }) {
  const Template = templateComponents[template.id];

  return (
    <article className="template-card">
      <div className="template-preview" aria-hidden="true">
        <div className="template-preview__render">
          {Template && (
            <div style={{ transform: "scale(0.32)", transformOrigin: "top left", width: "312.5%" }}>
              <Template data={sampleData} />
            </div>
          )}
        </div>
      </div>
      <div className="template-card__body">
        <h3 className="template-card__title">{template.name}</h3>
        <p className="template-card__text">{template.description}</p>
        <div className="list-card__meta">
          {template.features.map((feature) => (
            <span key={feature} className="chip">{feature}</span>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button block onClick={() => onSelect(template)}>
            Use Template
          </Button>
        </div>
      </div>
    </article>
  );
}

export default TemplateCard;
