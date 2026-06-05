import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportPDF(element, filename = "resume.pdf") {
  if (!element) throw new Error("No element to render");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 0;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;
  let firstPage = true;

  while (heightLeft > 0) {
    if (!firstPage) pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    position -= pageHeight;
    firstPage = false;
  }

  pdf.save(filename);
}

export function exportDOCXAsHTML(data, filename = "resume.doc") {
  const entries = (list) => {
    if (!list) return [];
    if (Array.isArray(list)) return list;
    try { return JSON.parse(list); } catch { return []; }
  };

  const skills = entries(data.skills);
  const experience = entries(data.experience);
  const education = entries(data.education);
  const projects = entries(data.projects);

  const contactParts = [data.email, data.phone, data.location].filter(Boolean);

  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Barlow', 'Calibri', 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.5; font-size: 11pt; }
  h1 { font-size: 26pt; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.3px; }
  .role { font-size: 14pt; color: #5C6770; margin: 0 0 8px; font-weight: 600; }
  .contact { font-size: 10pt; color: #5C6770; margin-bottom: 16px; }
  .divider { border: none; border-top: 1px solid #D0D7DE; margin: 16px 0; }
  h2 { font-size: 12pt; font-weight: 800; text-transform: uppercase; color: #5C6770; margin: 16px 0 8px; letter-spacing: 0.5px; }
  .summary { font-size: 11pt; color: #333; line-height: 1.5; margin: 0 0 16px; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .skill { font-size: 10pt; padding: 2px 10px; background: #E8EEF3; border-radius: 999px; color: #424A52; font-weight: 600; display: inline-block; margin: 2px 4px 2px 0; }
  .entry { margin-bottom: 14px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-size: 12pt; font-weight: 700; margin: 0; }
  .entry-sub { font-size: 11pt; color: #5C6770; margin: 2px 0 0; }
  .entry-date { font-size: 10pt; color: #8C97A2; font-weight: 600; white-space: nowrap; }
  .entry-desc { font-size: 11pt; color: #333; margin: 4px 0 0; line-height: 1.5; }
</style>
</head>
<body>
  <h1>${esc(data.fullName || "Your Name")}</h1>
  <p class="role">${esc(data.role || "")}</p>
  ${contactParts.length > 0 ? `<p class="contact">${contactParts.map(esc).join(" &nbsp;|&nbsp; ")}</p>` : ""}
  <hr class="divider">`;

  if (data.summary) {
    html += `<h2>Professional Summary</h2><p class="summary">${esc(data.summary)}</p>`;
  }

  if (skills.length > 0) {
    html += `<h2>Skills</h2><div class="skills">${skills.map((s) => `<span class="skill">${esc(s)}</span>`).join("")}</div>`;
  }

  if (experience.length > 0) {
    html += `<h2>Experience</h2>`;
    experience.forEach((e) => {
      html += `<div class="entry">
        <div class="entry-header">
          <div>
            <p class="entry-title">${esc(e.role || e.title || "")}</p>
            ${e.company ? `<p class="entry-sub">${esc(e.company)}</p>` : ""}
            ${e.institution ? `<p class="entry-sub">${esc(e.institution)}</p>` : ""}
          </div>
          ${(e.startDate || e.endDate) ? `<span class="entry-date">${esc(e.startDate || "")}${e.startDate && e.endDate ? " – " : ""}${esc(e.endDate || "")}</span>` : ""}
        </div>
        ${e.description ? `<p class="entry-desc">${esc(e.description)}</p>` : ""}
      </div>`;
    });
  }

  if (education.length > 0) {
    html += `<h2>Education</h2>`;
    education.forEach((e) => {
      const degreeLine = [e.degree, e.field].filter(Boolean).join(" in ");
      html += `<div class="entry">
        <p class="entry-title">${esc(degreeLine)}</p>
        ${e.institution ? `<p class="entry-sub">${esc(e.institution)}</p>` : ""}
        ${(e.startDate || e.endDate) ? `<p class="entry-date">${esc(e.startDate || "")}${e.startDate && e.endDate ? " – " : ""}${esc(e.endDate || "")}</p>` : ""}
      </div>`;
    });
  }

  if (projects.length > 0) {
    html += `<h2>Projects</h2>`;
    projects.forEach((p) => {
      html += `<div class="entry">
        <p class="entry-title">${esc(p.name || p.title || "")}</p>
        ${p.description ? `<p class="entry-desc">${esc(p.description)}</p>` : ""}
        ${p.technologies ? `<p class="entry-sub">Tech: ${esc(p.technologies)}</p>` : ""}
      </div>`;
    });
  }

  if (data.links) {
    html += `<h2>Links</h2><p style="font-size: 10pt; color: #5C6770; margin: 0;">${esc(data.links)}</p>`;
  }

  html += `</body></html>`;

  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function esc(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
