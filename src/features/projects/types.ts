export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export interface TopProject {
  id: string; // URL slug, e.g., 'e-commerce-platform'
  name: string;
  description: string;
  features: string[];
  github: string;
  liveDemo?: string;
  category?: "frontend" | "backend" | "fullstack";
  
  // New Case Study Fields
  role?: string;
  techStack?: string[];
  architecture?: string[];
  challenges?: string[];
  outcome?: string;
  images?: string[];
  team?: { name: string; role: string }[];
}

export type ProjectCategory = "frontend" | "backend" | "fullstack";

