import { templateComponents } from "./resume-templates";

function ResumePreview({ data, templateId = "minimal", scale = 1 }) {
  const Template = templateComponents[templateId] || templateComponents.minimal;

  if (!data) {
    return (
      <div style={{
        padding: 40, textAlign: "center", color: "#8C97A2",
        fontFamily: "'Barlow', 'Segoe UI', sans-serif", fontSize: 14,
      }}>
        Fill in your details to see a live preview
      </div>
    );
  }

  return (
    <div
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
        width: scale !== 1 ? `${100 / scale}%` : undefined,
      }}
    >
      <Template data={data} />
    </div>
  );
}

export default ResumePreview;
