import MinimalTemplate from "./MinimalTemplate";
import ProfileTemplate from "./ProfileTemplate";
import TechnicalTemplate from "./TechnicalTemplate";
import CreativeTemplate from "./CreativeTemplate";

export const templateComponents = {
  minimal: MinimalTemplate,
  profile: ProfileTemplate,
  technical: TechnicalTemplate,
  creative: CreativeTemplate,
};

export const sampleData = {
  fullName: "Alex Morgan",
  role: "Full-Stack Developer",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  summary:
    "Results-driven full-stack developer with 5+ years of experience designing and scaling web applications. Proficient in React, Node.js, and cloud infrastructure. Passionate about clean code, developer experience, and building products that make an impact.",
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "GraphQL"],
  experience: [
    { company: "TechCorp Inc.", role: "Senior Full-Stack Developer", startDate: "2021", endDate: "Present", description: "Led a team of 6 engineers building a real-time analytics platform serving 50k+ users. Migrated legacy monolith to microservices, reducing deployment time by 80%." },
    { company: "StartupXYZ", role: "Full-Stack Developer", startDate: "2019", endDate: "2021", description: "Built and maintained customer-facing dashboard and REST APIs. Implemented CI/CD pipelines and automated testing, achieving 95% code coverage." },
    { company: "WebAgency Co.", role: "Junior Developer", startDate: "2017", endDate: "2019", description: "Developed responsive web applications for 20+ clients using React and Node.js. Introduced component library that reduced development time by 30%." },
  ],
  education: [
    { institution: "University of California", degree: "B.S.", field: "Computer Science", startDate: "2013", endDate: "2017" },
  ],
  projects: [
    { name: "Portfolio Builder", description: "A full-stack web application for creating professional developer portfolios with live preview and PDF export.", technologies: "React, Node.js, MongoDB" },
    { name: "DevMetrics Dashboard", description: "Real-time analytics dashboard with customizable widgets and team collaboration features.", technologies: "React, D3.js, WebSockets" },
  ],
  links: "github.com/alexmorgan · linkedin.com/in/alexmorgan · alexmorgan.dev",
};

export const templateDisplayData = {
  minimal: {
    name: "Minimal Slate",
    description: "A clean single-column resume with generous spacing and calm slate accents.",
    features: ["Single column", "ATS friendly", "Quiet layout"],
  },
  profile: {
    name: "Profile Focus",
    description: "Strong intro section with balanced content blocks for early-career portfolios.",
    features: ["Profile header", "Skills band", "Project highlights"],
  },
  technical: {
    name: "Technical Lead",
    description: "Structured sections for technical experience, tools, systems, and impact.",
    features: ["Dense sections", "Experience first", "Project metrics"],
  },
  creative: {
    name: "Creative Pro",
    description: "A softer card layout for designers, builders, and multidisciplinary makers.",
    features: ["Card sections", "Portfolio links", "Soft contrast"],
  },
};
