import { Link, useNavigate } from "react-router-dom";
import type { Repository } from "@/components/Projects/types";
import { getProjectCategory } from "@/components/Projects/utils/projectCategory";
import { generateDescription } from "@/components/Projects/utils/projectDescription";
import { generateFeatures } from "@/components/Projects/utils/projectFeatures";
import { getTechnologyTags } from "@/components/Projects/utils/technologyTags";
import { getProjectImage } from "@/components/Projects/constants/projectImages";

interface ProjectCardProps {
  repo: Repository;
}

export const ProjectCard = ({ repo }: ProjectCardProps) => {
  if (!repo) return null;

  const navigate = useNavigate();
  const projectPath = `/projects/${repo.name}`;
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
    <div
      className="project-card project-card--clickable-case-study"
      onClick={() => navigate(projectPath)}
    >
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
          <Link
            to={projectPath}
            className="btn-view"
            aria-label={`${repo.name.replace(/-/g, " ")} — explore project`}
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-search-plus"></i>
            Explore Project
          </Link>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view btn-view-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fab fa-github"></i>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

