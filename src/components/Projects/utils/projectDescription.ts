import type { Repository } from "../types";
import { getProjectCategory } from "./projectCategory";

export const generateDescription = (repo: Repository): string => {
  const name = repo.name.toLowerCase();
  const language = (repo.language || "").toLowerCase();
  const category = getProjectCategory(repo);
  
  // Check if it's a portfolio/profile project
  if (name.includes("profile") || name.includes("portfolio") || name.includes("myprofile")) {
    return "Personal portfolio website showcasing projects, skills, and experience. Built with modern web technologies.";
  }
  
  // Check for specific project types
  if (name.includes("e-commerce") || name.includes("ecommerce")) {
    return "E-commerce platform with product management, shopping cart, and payment integration.";
  }
  
  if (name.includes("gym") || name.includes("fitness")) {
    return "Gym management system for tracking members, subscriptions, and facility management.";
  }
  
  if (name.includes("blog")) {
    return "Blog platform with content management, user authentication, and responsive design.";
  }
  
  if (name.includes("todo") || name.includes("task")) {
    return "Task management application for organizing and tracking daily activities.";
  }
  
  if (name.includes("api")) {
    return "RESTful API service providing backend functionality for web and mobile applications.";
  }
  
  if (name.includes("chat") || name.includes("messenger")) {
    return "Real-time messaging application with user authentication and chat functionality.";
  }
  
  // Generate based on category
  if (category === "frontend") {
    if (language.includes("typescript") || language.includes("ts")) {
      return "Modern frontend application built with React and TypeScript, featuring responsive design and interactive UI components.";
    }
    return "Frontend web application with responsive design and modern user interface.";
  }
  
  if (category === "backend") {
    if (language.includes("c#") || language.includes(".net")) {
      return "Backend API service built with ASP.NET Core, providing robust server-side functionality.";
    }
    return "Backend service providing API endpoints and server-side logic.";
  }
  
  // Default full-stack description
  if (language.includes("typescript") || language.includes("ts")) {
    return "Full-stack web application built with React, TypeScript, and modern backend technologies.";
  }
  
  return "Full-stack web application with modern architecture and responsive design.";
};

