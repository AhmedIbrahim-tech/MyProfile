import { useState, useMemo } from "react";
import { profileData } from "@/data/profileData";
import type { TopProject, PortfolioTier } from "@/modules/projects/types";
import {
  getProjectCategory,
  getTopProjectCategory,
} from "@/modules/projects/utils/projectCategory";
import {
  getTechnologyTags,
  getTopProjectTags,
} from "@/modules/projects/utils/technologyTags";
import { isCuratedProject } from "@/modules/projects/utils/projectDeduplication";
import { useRepositories } from "@/modules/projects/hooks/useRepositories";
import { ProjectCard } from "@/modules/projects/components/ProjectCard";
import { TopProjectCard } from "@/modules/projects/components/TopProjectCard";
import {
  ProjectFilters,
  type FilterCategory,
} from "@/modules/projects/components/ProjectFilters";
import Loading from "@/shared/components/feedback/Loading";
import "@/assets/styles/features/projects/Projects.css";

export const ProjectsList = () => {
  const { repos, loading } = useRepositories();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  // 1. Group A: Selected Projects (Authoritative Portfolio Case Studies from profileData)
  const selectedProjects: TopProject[] = useMemo(() => {
    return profileData.projects.map((project) => ({
      ...project,
      portfolioTier: (project.portfolioTier || "selected") as PortfolioTier,
      category: (project as TopProject).category || getTopProjectCategory(project as TopProject),
    }));
  }, []);

  // 2. Group B: Other GitHub Repositories (Secondary repositories, deduplicated against curated projects)
  const otherRepos = useMemo(() => {
    return repos.filter((repo) => !isCuratedProject(repo, selectedProjects));
  }, [repos, selectedProjects]);

  // Collect all unique technology tags from all active projects
  const availableTechnologies = useMemo(() => {
    const techSet = new Set<string>();

    // Add tags from curated selected projects (authoritative tech stack)
    selectedProjects.forEach((project) => {
      const tags = project.techStack && project.techStack.length > 0
        ? project.techStack
        : getTopProjectTags(project);
      tags.forEach((tag) => techSet.add(tag));
    });

    // Add tags from secondary deduplicated repos
    otherRepos.forEach((repo) => {
      const tags = getTechnologyTags(repo);
      tags.forEach((tag) => techSet.add(tag));
    });

    return Array.from(techSet).sort();
  }, [selectedProjects, otherRepos]);

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    let filteredSelectedProjects = selectedProjects;
    let filteredOtherRepos = otherRepos;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "top") {
        filteredOtherRepos = [];
      } else {
        filteredSelectedProjects = selectedProjects.filter(
          (project) => (project.category || getTopProjectCategory(project)) === selectedCategory
        );
        filteredOtherRepos = otherRepos.filter(
          (repo) => getProjectCategory(repo) === selectedCategory
        );
      }
    }

    // Filter by technologies
    if (selectedTechnologies.length > 0) {
      filteredSelectedProjects = filteredSelectedProjects.filter((project) => {
        const projectTags = project.techStack && project.techStack.length > 0
          ? project.techStack
          : getTopProjectTags(project);
        return selectedTechnologies.some((tech) => projectTags.includes(tech));
      });

      filteredOtherRepos = filteredOtherRepos.filter((repo) => {
        const repoTags = getTechnologyTags(repo);
        return selectedTechnologies.some((tech) => repoTags.includes(tech));
      });
    }

    return {
      topProjects: filteredSelectedProjects,
      repos: filteredOtherRepos,
      categorizedRepos: {
        frontend: filteredOtherRepos.filter(
          (repo) => getProjectCategory(repo) === "frontend"
        ),
        backend: filteredOtherRepos.filter(
          (repo) => getProjectCategory(repo) === "backend"
        ),
        fullstack: filteredOtherRepos.filter(
          (repo) => getProjectCategory(repo) === "fullstack"
        ),
      },
    };
  }, [selectedCategory, selectedTechnologies, selectedProjects, otherRepos]);

  if (loading) {
    return (
      <section className="projects" id="projects">
        <div className="projects-container">
          <div className="projects-hero">
            <div className="projects-eyebrow">04 — SELECTED WORK</div>
            <h1 className="projects-page-title">ENGINEERING SYSTEMS & PRODUCTS</h1>
          </div>
          <Loading message="Loading engineering projects..." size="md" className="projects-loading-state" />
        </div>
      </section>
    );
  }

  const hasProjects =
    filteredProjects.topProjects.length > 0 ||
    filteredProjects.repos.length > 0;

  const flagshipProjects = filteredProjects.topProjects.filter(
    (project) => project.portfolioTier === "flagship"
  );

  const selectedProjectsList = filteredProjects.topProjects.filter(
    (project) => project.portfolioTier !== "flagship"
  );

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        {/* Editorial Page Header */}
        <header className="projects-hero">
          <div className="projects-eyebrow" aria-hidden="true">
            04 — SELECTED WORK
          </div>
          <h1 className="projects-page-title">
            ENGINEERING SYSTEMS & PRODUCTS
          </h1>
          <p className="projects-intro">
            Curated enterprise platforms, ERP systems, and production business applications developed with ASP.NET Core, React, and SQL Server.
          </p>
        </header>

        {/* Filter Toolbar */}
        <ProjectFilters
          selectedCategory={selectedCategory}
          selectedTechnologies={selectedTechnologies}
          availableTechnologies={availableTechnologies}
          onCategoryChange={setSelectedCategory}
          onTechnologiesChange={setSelectedTechnologies}
        />

        {!hasProjects ? (
          <div className="no-projects-message" role="status">
            <i className="fas fa-search" aria-hidden="true"></i>
            <p className="no-projects-text">No projects found matching the selected criteria.</p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedTechnologies([]);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="projects-tiers-wrapper">
            {/* TIER 1: Flagship Projects */}
            {flagshipProjects.length > 0 && (
              <section className="flagship-projects-tier" aria-label="Flagship Projects">
                <div className="tier-header">
                  <span className="tier-badge">TIER 01 — FLAGSHIP</span>
                  <h2 className="tier-title">FLAGSHIP PROJECTS</h2>
                </div>
                <div className="selected-projects-list flagship-projects-list">
                  {flagshipProjects.map((project, index) => (
                    <TopProjectCard
                      key={project.id || index}
                      project={project}
                      index={index}
                      tier="flagship"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* TIER 2: Additional Case Studies */}
            {selectedProjectsList.length > 0 && (
              <section className="selected-projects-tier" aria-label="Additional Case Studies">
                <div className="tier-header">
                  <span className="tier-badge">TIER 02 — CASE STUDIES</span>
                  <h2 className="tier-title">ADDITIONAL CASE STUDIES</h2>
                </div>
                <div className="selected-projects-list selected-projects-list--secondary">
                  {selectedProjectsList.map((project, index) => (
                    <TopProjectCard
                      key={project.id || index}
                      project={project}
                      index={flagshipProjects.length + index}
                      tier="selected"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* TIER 3: More Work */}
            {filteredProjects.repos.length > 0 && (
              <section className="more-projects-tier" aria-label="More Work">
                <div className="tier-header tier-header--archive">
                  <div className="archive-title-group">
                    <span className="archive-badge">OPEN SOURCE · EXPERIMENTS · UTILITIES</span>
                    <h2 className="archive-title">MORE WORK</h2>
                  </div>
                </div>
                <div className="more-work-list">
                  {filteredProjects.repos.map((repo, index) => (
                    <ProjectCard key={repo.id} repo={repo} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsList;

