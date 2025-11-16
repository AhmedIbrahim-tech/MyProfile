import { useState, useEffect } from "react";
import axios from "axios";
import { profileData } from "../../data/profileData";
import { hiddenRepos } from "../../data/hiddenRepos";
import "./Projects.css";

interface Repository {
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

interface TopProject {
  name: string;
  description: string;
  features: string[];
  github: string;
  category?: "frontend" | "backend" | "fullstack";
}

const getProjectImage = (
  repoUrl: string,
  repoName?: string,
  description?: string,
  category?: "frontend" | "backend" | "fullstack"
): string => {
  const name = (repoName || repoUrl.split("/").pop() || "").toLowerCase();
  const desc = (description || "").toLowerCase();
  
  const imageMap: { [key: string]: string } = {
    "vitagymportalweb": "https://images.unsplash.com/photo-1734668486909-4637ecd66408?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "vitagym": "https://images.unsplash.com/photo-1734668486909-4637ecd66408?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "gym": "https://images.unsplash.com/photo-1734668486909-4637ecd66408?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "e-commerce": "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "ecommerce": "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "file-sharing": "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=400&fit=crop",
    "file sharing": "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=400&fit=crop",
    "instagram": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    "social media": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    "movie": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
    "movie site": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
    
    "portfolio": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop",
    "blog": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
    "todo": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop",
    "task": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop",
    "chat": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=400&fit=crop",
    "messenger": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=400&fit=crop",
    "api": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    "backend": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    "dashboard": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    "admin": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    "cms": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    "crud": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
    "auth": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    "login": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    "payment": "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=400&fit=crop",
    "shop": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    "restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    "food": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    "weather": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
    "news": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
    "game": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop",
    "music": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    "video": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=400&fit=crop",
    "stream": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=400&fit=crop",
    "learning": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    "course": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    "school": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    "hospital": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    "medical": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    "booking": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop",
    "hotel": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop",
    "travel": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop",
    "react": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    "angular": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    "vue": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    "node": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    "express": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    "asp.net": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    ".net": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    "mvc": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  };

  // Try to find a match in the image map
  let imageUrl = "";
  for (const [key, value] of Object.entries(imageMap)) {
    if (name.includes(key) || desc.includes(key)) {
      imageUrl = value;
      break;
    }
  }

  // If no match found, use category-based images
  if (!imageUrl) {
    if (category === "frontend") {
      imageUrl = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop";
    } else if (category === "backend") {
      imageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop";
    } else {
      imageUrl = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop";
    }
  }

  return imageUrl;
};

const getProjectCategory = (
  repo: Repository
): "frontend" | "backend" | "fullstack" => {
  const name = repo.name.toLowerCase();
  const description = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const language = (repo.language || "").toLowerCase();

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

  if (hasFrontend && hasBackend) return "fullstack";
  if (hasFrontend) return "frontend";
  if (hasBackend) return "backend";
  return "fullstack";
};

const getTopProjectCategory = (
  project: TopProject
): "frontend" | "backend" | "fullstack" => {
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


const isRepoHidden = (repoName: string): boolean => {
  const normalizedRepoName = repoName.toLowerCase().replace(/[-_\s]/g, "");
  return hiddenRepos.some(
    (hiddenRepo) =>
      hiddenRepo.toLowerCase().replace(/[-_\s]/g, "") === normalizedRepoName
  );
};

  
const getTechnologyTags = (repo: Repository): string[] => {
  const tags: Set<string> = new Set();
  const name = repo.name.toLowerCase();
  const description = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const language = (repo.language || "").toLowerCase();

  // Backend Technologies
  if (
    language.includes("c#") ||
    description.includes(".net") ||
    description.includes("asp.net") ||
    topics.includes("dotnet") ||
    topics.includes("csharp")
  ) {
    tags.add(".NET");
  }

  // Frontend Frameworks
  if (
    description.includes("react") ||
    topics.includes("react") ||
    topics.includes("reactjs") ||
    name.includes("react")
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


  if (language.includes("javascript") || language.includes("js")) {
    tags.add("JavaScript");
  }

  if (language.includes("typescript") || language.includes("ts")) {
    tags.add("TypeScript");
  }


  if (language.includes("c#")) {
    tags.add("C#");
  }

  // CSS Frameworks
  if (
    description.includes("bootstrap") ||
    topics.includes("bootstrap")
  ) {
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

  return Array.from(tags);
};

// Generate features for repositories that don't have topics
const generateFeatures = (repo: Repository): string[] => {
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

// Get technology tags for top projects
const getTopProjectTags = (project: TopProject): string[] => {
  const tags: Set<string> = new Set();
  const name = project.name.toLowerCase();
  const description = project.description.toLowerCase();
  const features = project.features.join(" ").toLowerCase();

  // Backend Technologies
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

  // Frontend Frameworks
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

  // Other Technologies
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

const Projects = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/users/AhmedIbrahim-tech/repos",
          {
            params: {
              sort: "updated",
              per_page: 100,
            },
          }
        );
        // Filter out hidden repositories
        const filteredRepos = response.data.filter(
          (repo: Repository) => !isRepoHidden(repo.name)
        );
        setRepos(filteredRepos);
        setLoading(false);
      } catch {
        setError("Failed to fetch repositories");
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const topProjects: TopProject[] = profileData.projects.map((project) => ({
    ...project,
    category: getTopProjectCategory(project),
  }));

  const categorizedRepos = {
    frontend: repos.filter((repo) => getProjectCategory(repo) === "frontend"),
    backend: repos.filter((repo) => getProjectCategory(repo) === "backend"),
    fullstack: repos.filter((repo) => getProjectCategory(repo) === "fullstack"),
  };

  const ProjectCard = ({ repo }: { repo: Repository }) => {
    if (!repo) return null;

    const category = getProjectCategory(repo);
    const imageUrl = getProjectImage(
      repo.html_url,
      repo.name,
      repo.description,
      category
    );
    const techTags = getTechnologyTags(repo);

    return (
      <div className="project-card">
        <div className="project-image-container">
          <img
            src={imageUrl}
            alt={repo.name}
            className="project-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x200/7C3AED/ffffff?text=" +
                encodeURIComponent(repo.name);
            }}
          />
          {category && (
            <div className={`project-badge category-${category}`}>
              {category === "fullstack"
                ? "Full Stack"
                : category === "frontend"
                ? "Front End"
                : "Back End"}
            </div>
          )}
        </div>
        <div className="project-content">
          <div className="project-header">
            <h3>{repo.name.replace(/-/g, " ").replace(/_/g, " ")}</h3>
          </div>
          <p className="project-description">
            {repo.description || "No description available"}
          </p>

          {techTags.length > 0 && (
            <div className="tech-tags">
              {techTags.map((tag, index) => (
                <span key={index} className="tech-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <ul className="project-features">
            {(repo.topics && repo.topics.length > 0
              ? repo.topics.slice(0, 3)
              : generateFeatures(repo)
            ).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <div className="project-actions">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view"
            >
              <i className="fab fa-github"></i>
              View on GitHub
            </a>
            <button
              className="btn-view btn-view-secondary btn-disabled"
              disabled
            >
              <i className="fas fa-external-link-alt"></i>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="projects" id="projects">
        <div className="projects-container">
          <h2 className="section-title">
            <i className="fas fa-folder-open"></i>
            <span>
              My <strong>Projects</strong>
            </span>
          </h2>
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="projects" id="projects">
        <div className="projects-container">
          <h2 className="section-title">
            <i className="fas fa-folder-open"></i>
            <span>
              My <strong>Projects</strong>
            </span>
          </h2>
          <div className="error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <h2 className="section-title">
          <i className="fas fa-folder-open"></i>
          <span>
            My <strong>Projects</strong>
          </span>
        </h2>

        {/* Top Projects Section */}
        <div className="projects-section">
          <h3 className="section-subtitle">
            <i className="fas fa-star"></i>
            Top Projects
          </h3>
        <div className="projects-grid">
            {topProjects.map((project, index) => {
              const category = project.category || getTopProjectCategory(project);
              const imageUrl = getProjectImage(
                project.github,
                project.name,
                project.description,
                category
              );
              const techTags = getTopProjectTags(project);
              return (
                <div key={index} className="project-card">
                  <div className="project-image-container">
                    <img
                      src={imageUrl}
                      alt={project.name}
                      className="project-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x200/7C3AED/ffffff?text=" +
                          encodeURIComponent(project.name);
                      }}
                    />
                    <div className="project-badge">Top Project</div>
                  </div>
                  <div className="project-content">
              <div className="project-header">
                      <h3>{project.name}</h3>
                </div>
                    <p className="project-description">{project.description}</p>
                    {techTags.length > 0 && (
                      <div className="tech-tags">
                        {techTags.map((tag, idx) => (
                          <span key={idx} className="tech-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.features && project.features.length > 0 && (
                      <ul className="project-features">
                        {project.features[0]
                          .split(",")
                          .slice(0, 3)
                          .map((feature, idx) => (
                            <li key={idx}>{feature.trim()}</li>
                          ))}
                      </ul>
                    )}
              <div className="project-actions">
                <a 
                        href={project.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-view"
                >
                        <i className="fab fa-github"></i>
                  View on GitHub
                </a>
                <button
                  className="btn-view btn-view-secondary btn-disabled"
                  disabled
                >
                  <i className="fas fa-external-link-alt"></i>
                  Coming Soon
                </button>
              </div>
            </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All GitHub Repositories - Full Stack */}
        {categorizedRepos.fullstack.length > 0 && (
          <div className="projects-section">
            <h3 className="section-subtitle">
              <i className="fas fa-layer-group"></i>
              Full-Stack Projects
            </h3>
            <div className="projects-grid">
              {categorizedRepos.fullstack.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* All GitHub Repositories - Front End */}
        {categorizedRepos.frontend.length > 0 && (
          <div className="projects-section">
            <h3 className="section-subtitle">
              <i className="fas fa-desktop"></i>
              Front-End Projects
            </h3>
            <div className="projects-grid">
              {categorizedRepos.frontend.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* All GitHub Repositories - Back End */}
        {categorizedRepos.backend.length > 0 && (
          <div className="projects-section">
            <h3 className="section-subtitle">
              <i className="fas fa-server"></i>
              Back-End Projects
            </h3>
            <div className="projects-grid">
              {categorizedRepos.backend.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
