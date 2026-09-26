import { Link } from "react-router-dom";
import type { TopProject } from "@/modules/projects/types";
import { getTopProjectCategory } from "@/modules/projects/utils/projectCategory";
import { getTopProjectTags } from "@/modules/projects/utils/technologyTags";
import { getProjectImage } from "@/modules/projects/constants/projectImages";

interface TopProjectCardProps {
  project: TopProject;
  index?: number;
  tier?: "flagship" | "selected";
}

export const TopProjectCard = ({ project, index = 0, tier }: TopProjectCardProps) => {
  const caseStudyPath = `/projects/${project.id}`;
  const category = project.category || getTopProjectCategory(project);
  const effectiveTier = tier || project.portfolioTier || "selected";
  const isFlagship = effectiveTier === "flagship";

  const imageUrl = getProjectImage(
    project.github,
    project.name,
    project.description,
    category
  );

  // Curated tech stack priority (Phase 1 rule)
  const techStack =
    project.techStack && project.techStack.length > 0
      ? project.techStack
      : getTopProjectTags(project);

  const formattedIndex = String(index + 1).padStart(2, "0");
  const categoryLabel =
    category === "fullstack"
      ? "Full Stack"
      : category === "frontend"
      ? "Frontend"
      : "Backend";

  return (
    <article className={`selected-project-row selected-project-row--${effectiveTier}`}>
      <div className="selected-project-content">
        <div className="selected-project-eyebrow">
          <span className={`tier-marker-tag tier-marker-tag--${effectiveTier}`}>
            {isFlagship ? "FLAGSHIP SYSTEM" : "CASE STUDY"}
          </span>
          <span className="selected-project-index">PROJECT {formattedIndex}</span>
          <span className="selected-project-eyebrow-sep">/</span>
          <span className="selected-project-category">{categoryLabel}</span>
        </div>

        <h3 className="selected-project-title">
          <Link to={caseStudyPath} className="selected-project-title-link">
            {project.name}
          </Link>
        </h3>

        {project.role && (
          <div className="selected-project-role">
            <span className="role-label">Role:</span>
            <span className="role-value">{project.role}</span>
          </div>
        )}

        <p className="selected-project-description">{project.description}</p>

        {techStack.length > 0 && (
          <div className="selected-project-tech-inline" aria-label="Key Technologies">
            {techStack.map((tech, idx) => (
              <span key={tech} className="tech-inline-item">
                {tech.toUpperCase()}
                {idx < techStack.length - 1 && <span className="tech-inline-sep">·</span>}
              </span>
            ))}
          </div>
        )}

        <div className="selected-project-actions">
          <Link
            to={caseStudyPath}
            className="btn-selected-primary"
            aria-label={`View case study for ${project.name}`}
          >
            <span>View Case Study</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </Link>

          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-selected-secondary"
              aria-label={`Visit live demo for ${project.name} (opens in new tab)`}
            >
              <span>Live Project</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          )}

          {project.github && project.showGitHub !== false && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-selected-secondary"
              aria-label={`View ${project.name} on GitHub (opens in new tab)`}
            >
              <span>GitHub</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      <div className="selected-project-visual">
        <Link
          to={caseStudyPath}
          className="selected-project-visual-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={imageUrl}
            alt=""
            className="selected-project-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/600x380/0d1222/38bdf8?text=" +
                encodeURIComponent(project.name);
            }}
          />
        </Link>
      </div>
    </article>
  );
};

