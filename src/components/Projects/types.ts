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
  name: string;
  description: string;
  features: string[];
  github: string;
  category?: "frontend" | "backend" | "fullstack";
}

export type ProjectCategory = "frontend" | "backend" | "fullstack";

