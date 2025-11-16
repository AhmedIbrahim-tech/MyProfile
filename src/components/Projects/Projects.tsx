import { profileData } from "../../data/profileData";
import type { TopProject } from "./types";
import { getProjectCategory } from "./utils/projectCategory";
import { getTopProjectCategory } from "./utils/projectCategory";
import { useRepositories } from "./hooks/useRepositories";
import { ProjectCard } from "./components/ProjectCard";
import { TopProjectCard } from "./components/TopProjectCard";
import "./Projects.css";

const Projects = () => {
  const { repos, loading, error } = useRepositories();

  const topProjects: TopProject[] = profileData.projects.map((project) => ({
    ...project,
    category: getTopProjectCategory(project),
  }));

  const categorizedRepos = {
    frontend: repos.filter((repo) => getProjectCategory(repo) === "frontend"),
    backend: repos.filter((repo) => getProjectCategory(repo) === "backend"),
    fullstack: repos.filter((repo) => getProjectCategory(repo) === "fullstack"),
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
            {topProjects.map((project, index) => (
              <TopProjectCard key={index} project={project} />
            ))}
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
