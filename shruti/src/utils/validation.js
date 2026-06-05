export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateLogin(values) {
  const errors = {};

  if (!values.email?.trim()) errors.email = "Email is required";
  else if (!isEmail(values.email.trim())) errors.email = "Enter a valid email address";

  if (!values.password) errors.password = "Password is required";

  return errors;
}

export function validateSignup(values) {
  const errors = {};

  if (!values.name?.trim()) errors.name = "Full name is required";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!values.email?.trim()) errors.email = "Email is required";
  else if (!isEmail(values.email.trim())) errors.email = "Enter a valid email address";

  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 8) errors.password = "Use at least 8 characters";
  else if (!/[A-Z]/.test(values.password)) errors.password = "Include one uppercase letter";
  else if (!/[0-9]/.test(values.password)) errors.password = "Include one number";

  if (!values.confirmPassword) errors.confirmPassword = "Confirm your password";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match";

  return errors;
}

export function validateProject(values) {
  const errors = {};

  if (!values.title?.trim()) errors.title = "Project title is required";
  if (!values.description?.trim()) errors.description = "Project description is required";
  if (values.githubLink && !isUrl(values.githubLink)) errors.githubLink = "Enter a valid URL";
  if (values.liveLink && !isUrl(values.liveLink)) errors.liveLink = "Enter a valid URL";
  if (values.imageUrl && !isUrl(values.imageUrl)) errors.imageUrl = "Enter a valid URL";

  return errors;
}

export function validatePortfolio(values) {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = "Full name is required";
  if (!values.role?.trim()) errors.role = "Role is required";
  if (!values.about?.trim()) errors.about = "About section is required";
  if (values.email && !isEmail(values.email)) errors.email = "Enter a valid email";
  if (values.githubLink && !isUrl(values.githubLink)) errors.githubLink = "Enter a valid URL";
  if (values.linkedinLink && !isUrl(values.linkedinLink)) errors.linkedinLink = "Enter a valid URL";

  return errors;
}

export function validateResume(values) {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = "Full name is required";
  if (!values.role?.trim()) errors.role = "Role is required";
  if (!values.summary?.trim()) errors.summary = "Professional summary is required";
  if (values.email && !isEmail(values.email)) errors.email = "Enter a valid email";

  return errors;
}

function isUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}
