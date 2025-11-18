import type { Repository } from "../types";
import { getProjectCategory } from "../utils/projectCategory";
import { generateDescription } from "../utils/projectDescription";
import { generateFeatures } from "../utils/projectFeatures";
import { getTechnologyTags } from "../utils/technologyTags";
import { getProjectImage } from "../constants/projectImages";

interface ProjectCardProps {
  repo: Repository;
}

export const ProjectCard = ({ repo }: ProjectCardProps) => {
  if (!repo) return null;

  const category = getProjectCategory(repo);
  const description = repo.description || generateDescription(repo);
  const imageUrl = getProjectImage(
    repo.html_url,
    repo.name,
    description,
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
          {description}
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
          {generateFeatures(repo).map((feature, index) => (
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
          {repo.homepage ? (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view btn-view-secondary"
            >
              <i className="fas fa-external-link-alt"></i>
              Live Demo
            </a>
          ) : (
            <button
              className="btn-view btn-view-secondary btn-disabled"
              disabled
            >
              <i className="fas fa-external-link-alt"></i>
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

