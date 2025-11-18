import { useState, useMemo } from "react";
import { profileData } from "../../data/profileData";
import type { TopProject } from "./types";
import { getProjectCategory } from "./utils/projectCategory";
import { getTopProjectCategory } from "./utils/projectCategory";
import { getTechnologyTags } from "./utils/technologyTags";
import { getTopProjectTags } from "./utils/technologyTags";
import { useRepositories } from "./hooks/useRepositories";
import { ProjectCard } from "./components/ProjectCard";
import { TopProjectCard } from "./components/TopProjectCard";
import { ProjectFilters, type FilterCategory } from "./components/ProjectFilters";
import "./Projects.css";

const Projects = () => {
  const { repos, loading, error } = useRepositories();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const topProjects: TopProject[] = profileData.projects.map((project) => ({
    ...project,
    category: getTopProjectCategory(project),
  }));

  const categorizedRepos = {
    frontend: repos.filter((repo) => getProjectCategory(repo) === "frontend"),
    backend: repos.filter((repo) => getProjectCategory(repo) === "backend"),
    fullstack: repos.filter((repo) => getProjectCategory(repo) === "fullstack"),
  };

  // Collect all unique technology tags from all projects
  const availableTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    
    // Add tags from repos
    repos.forEach((repo) => {
      const tags = getTechnologyTags(repo);
      tags.forEach((tag) => techSet.add(tag));
    });
    
    // Add tags from top projects
    topProjects.forEach((project) => {
      const tags = getTopProjectTags(project);
      tags.forEach((tag) => techSet.add(tag));
    });
    
    return Array.from(techSet).sort();
  }, [repos, topProjects]);

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    let filteredTopProjects = topProjects;
    let filteredRepos = repos;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "top") {
        filteredRepos = [];
      } else {
        filteredTopProjects = [];
        filteredRepos = repos.filter(
          (repo) => getProjectCategory(repo) === selectedCategory
        );
      }
    }

    // Filter by technologies
    if (selectedTechnologies.length > 0) {
      // Filter top projects
      filteredTopProjects = filteredTopProjects.filter((project) => {
        const projectTags = getTopProjectTags(project);
        return selectedTechnologies.some((tech) => projectTags.includes(tech));
      });

      // Filter repos
      filteredRepos = filteredRepos.filter((repo) => {
        const repoTags = getTechnologyTags(repo);
        return selectedTechnologies.some((tech) => repoTags.includes(tech));
      });
    }

    return {
      topProjects: filteredTopProjects,
      repos: filteredRepos,
      categorizedRepos: {
        frontend: filteredRepos.filter(
          (repo) => getProjectCategory(repo) === "frontend"
        ),
        backend: filteredRepos.filter(
          (repo) => getProjectCategory(repo) === "backend"
        ),
        fullstack: filteredRepos.filter(
          (repo) => getProjectCategory(repo) === "fullstack"
        ),
      },
    };
  }, [selectedCategory, selectedTechnologies, repos, topProjects]);

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

  const hasProjects =
    filteredProjects.topProjects.length > 0 ||
    filteredProjects.repos.length > 0;

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <h2 className="section-title">
          <i className="fas fa-folder-open"></i>
          <span>
            My <strong>Projects</strong>
          </span>
        </h2>

        <ProjectFilters
          selectedCategory={selectedCategory}
          selectedTechnologies={selectedTechnologies}
          availableTechnologies={availableTechnologies}
          onCategoryChange={setSelectedCategory}
          onTechnologiesChange={setSelectedTechnologies}
        />

        {!hasProjects ? (
          <div className="no-projects-message">
            <i className="fas fa-search"></i>
            <p>No projects found matching your filters.</p>
            <p className="no-projects-hint">
              Try adjusting your filter criteria or clear all filters.
            </p>
          </div>
        ) : (
          <>
            {/* Top Projects Section */}
            {filteredProjects.topProjects.length > 0 && (
              <div className="projects-section">
                <h3 className="section-subtitle">
                  <i className="fas fa-star"></i>
                  Top Projects
                </h3>
                <div className="projects-grid">
                  {filteredProjects.topProjects.map((project, index) => (
                    <TopProjectCard key={index} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* All GitHub Repositories - Full Stack */}
            {filteredProjects.categorizedRepos.fullstack.length > 0 && (
              <div className="projects-section">
                <h3 className="section-subtitle">
                  <i className="fas fa-layer-group"></i>
                  Full-Stack Projects
                </h3>
                <div className="projects-grid">
                  {filteredProjects.categorizedRepos.fullstack.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </div>
            )}

            {/* All GitHub Repositories - Front End */}
            {filteredProjects.categorizedRepos.frontend.length > 0 && (
              <div className="projects-section">
                <h3 className="section-subtitle">
                  <i className="fas fa-desktop"></i>
                  Front-End Projects
                </h3>
                <div className="projects-grid">
                  {filteredProjects.categorizedRepos.frontend.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </div>
            )}

            {/* All GitHub Repositories - Back End */}
            {filteredProjects.categorizedRepos.backend.length > 0 && (
              <div className="projects-section">
                <h3 className="section-subtitle">
                  <i className="fas fa-server"></i>
                  Back-End Projects
                </h3>
                <div className="projects-grid">
                  {filteredProjects.categorizedRepos.backend.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
