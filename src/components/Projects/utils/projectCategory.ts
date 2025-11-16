import type { Repository, TopProject, ProjectCategory } from "../types";

export const getProjectCategory = (repo: Repository): ProjectCategory => {
  const name = repo.name.toLowerCase();
  const description = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const language = (repo.language || "").toLowerCase();

  // Special cases for known full-stack projects
  if (
    name === "bookify" ||
    name.includes("bookify") ||
    name.includes("book rental") ||
    description.includes("bookify") ||
    description.includes("book rental")
  ) {
    return "fullstack";
  }

  // ASP.NET Core MVC is inherently full-stack (includes both frontend views and backend controllers)
  // Check if it's explicitly mentioned as full-stack with MVC
  if (
    (description.includes("asp.net core mvc") ||
      description.includes("asp.net mvc") ||
      description.includes(".net core mvc") ||
      description.includes(".net mvc")) &&
    (description.includes("full-stack") || description.includes("fullstack") || description.includes("both frontend and backend"))
  ) {
    return "fullstack";
  }

  const frontendKeywords = [
    "react",
    "angular",
    "vue",
    "frontend",
    "front-end",
    "ui",
    "client",
    "html",
    "css",
    "javascript",
    "typescript",
    "tailwind",
    "bootstrap",
  ];
  const backendKeywords = [
    "api",
    "backend",
    "back-end",
    "server",
    ".net",
    "asp.net",
    "core",
    "mvc",
    "c#",
    "sql",
    "database",
    "orm",
    "entity",
  ];

  const hasFrontend = frontendKeywords.some(
    (keyword) =>
      name.includes(keyword) ||
      description.includes(keyword) ||
      topics.includes(keyword) ||
      language.includes(keyword)
  );
  const hasBackend = backendKeywords.some(
    (keyword) =>
      name.includes(keyword) ||
      description.includes(keyword) ||
      topics.includes(keyword) ||
      language.includes(keyword)
  );

  // If description explicitly mentions "full-stack" or "fullstack", prioritize that
  if (description.includes("full-stack") || description.includes("fullstack")) {
    return "fullstack";
  }

  // ASP.NET Core MVC projects are typically full-stack
  if (
    (description.includes("asp.net core mvc") ||
      description.includes("asp.net mvc") ||
      (description.includes("mvc") && description.includes("asp.net"))) &&
    !description.includes("api only")
  ) {
    return "fullstack";
  }

  if (hasFrontend && hasBackend) return "fullstack";
  if (hasFrontend) return "frontend";
  if (hasBackend) return "backend";
  return "fullstack";
};

export const getTopProjectCategory = (project: TopProject): ProjectCategory => {
  const name = project.name.toLowerCase();
  const description = project.description.toLowerCase();

  if (
    name.includes("e-commerce") ||
    description.includes("angular") ||
    description.includes("react")
  )
    return "fullstack";
  if (
    description.includes("asp.net") ||
    description.includes(".net") ||
    description.includes("mvc")
  )
    return "backend";
  return "fullstack";
};

