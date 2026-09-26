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
  showGitHub?: boolean;
}

export type PortfolioTier = "flagship" | "selected";

export interface TopProject {
  id: string; // URL slug, e.g., 'e-commerce-platform'
  name: string;
  description: string;
  features: string[];
  github: string;
  liveDemo?: string;
  category?: "frontend" | "backend" | "fullstack";
  portfolioTier?: PortfolioTier;
  showGitHub?: boolean;

  // Case Study Fields
  purpose?: string;
  role?: string;
  contribution?: string;
  techStack?: string[];
  architecture?: string[];
  challenges?: string[];
  outcome?: string;
  images?: string[];
  team?: { name: string; role: string }[];
}

export type ProjectCategory = "frontend" | "backend" | "fullstack";

export interface GitHubRepoDetails extends Repository {
  watchers_count: number;
  open_issues_count: number;
  license: { name: string } | null;
  pushed_at: string;
  size: number;
  default_branch: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface ParsedReadmeSections {
  narrative: string;
  architecture: string[];
  features: string[];
  challenges: string[];
  metrics: string[];
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface InferredTechnicalDetails {
  architecture: string[];
  features: string[];
}

export interface ProjectDetails {
  name: string;
  description: string;
  finalNarrative: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  category: string;
  imageUrl: string;
  githubData: GitHubRepoDetails | null;
  caseStudy: TopProject | null;
  techTags: string[];
  teamMembers: TeamMember[];
  contributors: GitHubContributor[];
  architecture: string[];
  features: string[];
  challenges: string[];
  metrics: string[];
  role?: string;
  contribution?: string;
  purpose?: string;
  outcome?: string;
  showGitHub?: boolean;
}

