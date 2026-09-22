import type { Repository, TopProject } from "@/modules/projects/types";
import { getProjectCategory } from "@/modules/projects/utils/projectCategory";

export const getTechnologyTags = (repo: Repository): string[] => {
  const tags: Set<string> = new Set();
  const name = repo.name.toLowerCase();
  const description = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const language = (repo.language || "").toLowerCase();

  // Special handling for MyProfile/Portfolio repos (typically React + TypeScript)
  const isProfileRepo =
    name === "myprofile" || name.includes("my-profile") || name.includes("portfolio");
  if (isProfileRepo) {
    tags.add("React");
    tags.add("TypeScript");
  }

  // Backend Technologies
  if (
    language.includes("c#") ||
    description.includes(".net") ||
    description.includes("asp.net") ||
    topics.includes("dotnet") ||
    topics.includes("csharp") ||
    topics.includes("asp.net")
  ) {
    tags.add(".NET");
  }

  // Frontend Frameworks
  if (
    description.includes("react") ||
    topics.includes("react") ||
    topics.includes("reactjs") ||
    topics.includes("react.js") ||
    name.includes("react") ||
    topics.includes("tsx") ||
    topics.includes("jsx")
  ) {
    tags.add("React");
  }

  if (
    description.includes("angular") ||
    topics.includes("angular") ||
    name.includes("angular")
  ) {
    tags.add("Angular");
  }

  // TypeScript detection
  if (
    language.includes("typescript") ||
    language.includes("ts") ||
    description.includes("typescript") ||
    description.includes("tsx") ||
    topics.includes("typescript") ||
    topics.includes("tsx") ||
    topics.includes("ts") ||
    name.includes("typescript") ||
    name.includes("-ts") ||
    name.includes("ts-")
  ) {
    tags.add("TypeScript");
  }

  if (tags.has("React") && !tags.has("TypeScript")) {
    if (
      description.includes("vite") ||
      description.includes("typescript") ||
      topics.includes("vite") ||
      topics.includes("typescript") ||
      name.includes("vite") ||
      name.includes("ts")
    ) {
      tags.add("TypeScript");
    }
  }

  if (tags.has("TypeScript") && !tags.has("React")) {
    if (
      description.includes("react") ||
      description.includes("frontend") ||
      description.includes("ui") ||
      topics.includes("react") ||
      topics.includes("frontend") ||
      name.includes("react") ||
      name.includes("frontend")
    ) {
      tags.add("React");
    }
  }

  if (
    !tags.has("TypeScript") &&
    (language.includes("javascript") ||
      language.includes("js") ||
      description.includes("javascript") ||
      topics.includes("javascript") ||
      topics.includes("js"))
  ) {
    tags.add("JavaScript");
  }

  if (language.includes("c#")) {
    tags.add("C#");
  }

  // CSS Frameworks
  if (description.includes("bootstrap") || topics.includes("bootstrap")) {
    tags.add("Bootstrap");
  }

  if (
    description.includes("tailwind") ||
    topics.includes("tailwindcss") ||
    topics.includes("tailwind")
  ) {
    tags.add("Tailwind");
  }

  if (
    description.includes("sql") ||
    description.includes("database") ||
    topics.includes("sql") ||
    topics.includes("mssql") ||
    topics.includes("mysql")
  ) {
    tags.add("SQL");
  }

  if (description.includes("api") || topics.includes("api")) {
    tags.add("API");
  }

  // Fallback
  if (tags.size === 0) {
    const category = getProjectCategory(repo);

    if (language && language.trim() !== "") {
      const langLower = language.toLowerCase();
      if (langLower.includes("typescript") || langLower.includes("ts")) {
        tags.add("TypeScript");
      } else if (langLower.includes("javascript") || langLower.includes("js")) {
        tags.add("JavaScript");
      } else if (
        langLower.includes("c#") ||
        langLower.includes("csharp") ||
        langLower.includes("c sharp")
      ) {
        tags.add("C#");
        tags.add(".NET");
      } else if (langLower.includes("python")) {
        tags.add("Python");
      } else if (langLower.includes("java")) {
        tags.add("Java");
      } else if (langLower.includes("php")) {
        tags.add("PHP");
      } else if (langLower.includes("html")) {
        tags.add("HTML");
      } else if (langLower.includes("css")) {
        tags.add("CSS");
      } else {
        const capitalizedLang =
          language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
        tags.add(capitalizedLang);
      }
    }

    if (category === "frontend") {
      if (!tags.has("React") && !tags.has("Angular") && !tags.has("Vue")) {
        if (
          description.includes("html") ||
          description.includes("css") ||
          name.includes("html") ||
          name.includes("css")
        ) {
          tags.add("HTML/CSS");
        } else {
          tags.add("Frontend");
        }
      }
    } else if (category === "backend") {
      if (!tags.has(".NET") && !tags.has("C#")) {
        if (
          description.includes("server") ||
          description.includes("backend") ||
          name.includes("api") ||
          name.includes("server")
        ) {
          tags.add("Backend");
        }
      }
    } else if (category === "fullstack") {
      tags.add("Full Stack");
    }

    if (tags.size === 0) {
      if (name.includes("web") || name.includes("app") || name.includes("site")) {
        tags.add("Web");
      } else if (name.includes("api") || name.includes("service")) {
        tags.add("API");
      } else if (name.includes("tool") || name.includes("util")) {
        tags.add("Tool");
      } else {
        tags.add("Project");
      }
    }
  }

  return Array.from(tags);
};

export const getTopProjectTags = (project: TopProject): string[] => {
  const tags: Set<string> = new Set();
  const name = project.name.toLowerCase();
  const description = project.description.toLowerCase();
  const features = project.features.join(" ").toLowerCase();

  if (
    description.includes(".net") ||
    description.includes("asp.net") ||
    features.includes(".net") ||
    features.includes("asp.net")
  ) {
    tags.add(".NET");
  }

  if (description.includes("c#") || features.includes("c#")) {
    tags.add("C#");
  }

  if (
    description.includes("react") ||
    features.includes("react") ||
    name.includes("react")
  ) {
    tags.add("React");
  }

  if (
    description.includes("angular") ||
    features.includes("angular") ||
    name.includes("angular")
  ) {
    tags.add("Angular");
  }

  if (description.includes("mvc") || features.includes("mvc")) {
    tags.add("MVC");
  }

  if (description.includes("api") || features.includes("api")) {
    tags.add("API");
  }

  if (
    description.includes("sql") ||
    description.includes("database") ||
    features.includes("sql") ||
    features.includes("database")
  ) {
    tags.add("SQL");
  }

  return Array.from(tags);
};
