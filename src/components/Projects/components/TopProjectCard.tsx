import type { TopProject } from "../types";
import { getTopProjectCategory } from "../utils/projectCategory";
import { getTopProjectTags } from "../utils/technologyTags";
import { getProjectImage } from "../constants/projectImages";

interface TopProjectCardProps {
  project: TopProject;
}

export const TopProjectCard = ({ project }: TopProjectCardProps) => {
  const category = project.category || getTopProjectCategory(project);
  const imageUrl = getProjectImage(
    project.github,
    project.name,
    project.description,
    category
  );
  const techTags = getTopProjectTags(project);

  return (
    <div className="project-card">
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
};

