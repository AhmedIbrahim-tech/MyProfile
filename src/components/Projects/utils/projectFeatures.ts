import type { Repository } from "../types";
import { getProjectCategory } from "./projectCategory";

export const generateFeatures = (repo: Repository): string[] => {
  const features: string[] = [];
  const name = repo.name.toLowerCase();
  const description = (repo.description || "").toLowerCase();
  const category = getProjectCategory(repo);
  const language = (repo.language || "").toLowerCase();

  // Generate features based on category
  if (category === "frontend") {
    features.push("Responsive design implementation");
    features.push("Modern UI/UX components");
    if (description.includes("react") || name.includes("react")) {
      features.push("React component architecture");
    } else if (description.includes("angular") || name.includes("angular")) {
      features.push("Angular framework integration");
    }
  } else if (category === "backend") {
    features.push("RESTful API development");
    features.push("Database integration");
    if (description.includes(".net") || description.includes("asp.net")) {
      features.push("ASP.NET Core implementation");
    } else if (language.includes("javascript") || language.includes("typescript")) {
      features.push("Node.js server architecture");
    }
  } else {
    // Full stack
    features.push("Full-stack application development");
    features.push("User authentication system");
    if (description.includes("e-commerce") || name.includes("ecommerce") || name.includes("e-commerce")) {
      features.push("E-commerce functionality");
    } else if (description.includes("api") || name.includes("api")) {
      features.push("API integration");
    } else {
      features.push("Database management");
    }
  }

  // Add language-specific features
  if (language.includes("c#") || description.includes(".net")) {
    if (!features.some(f => f.toLowerCase().includes(".net"))) {
      features.push(".NET framework features");
    }
  }

  // Add generic features if we don't have enough
  if (features.length < 3) {
    if (repo.stargazers_count > 0) {
      features.push("Open source contribution");
    }
    if (repo.forks_count > 0) {
      features.push("Code reusability");
    }
    if (features.length < 3) {
      features.push("Clean code architecture");
    }
  }

  return features.slice(0, 3);
};

