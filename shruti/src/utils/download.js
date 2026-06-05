export function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function toSafeFilename(value, fallback = "download") {
  return (value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || fallback;
}

export function projectToText(project) {
  return [
    project.title,
    "",
    project.description,
    "",
    project.technologies ? `Technologies: ${project.technologies}` : "",
    project.githubLink ? `GitHub: ${project.githubLink}` : "",
    project.liveLink ? `Live Demo: ${project.liveLink}` : "",
  ].filter(Boolean).join("\n");
}

export function resumeToText(resume) {
  return [
    resume.title || `${resume.fullName} Resume`,
    "",
    `${resume.fullName} - ${resume.role}`,
    [resume.email, resume.phone, resume.location].filter(Boolean).join(" | "),
    "",
    "Summary",
    resume.summary,
    "",
    resume.skills ? `Skills\n${resume.skills}` : "",
    resume.experience ? `Experience\n${resume.experience}` : "",
    resume.education ? `Education\n${resume.education}` : "",
    resume.projects ? `Projects\n${resume.projects}` : "",
    resume.links ? `Links\n${resume.links}` : "",
  ].filter(Boolean).join("\n");
}
