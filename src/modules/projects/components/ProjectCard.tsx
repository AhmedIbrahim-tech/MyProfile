import { Link } from "react-router-dom";
import type { Repository } from "@/modules/projects/types";
import { getProjectCategory } from "@/modules/projects/utils/projectCategory";

interface ProjectCardProps {
  repo: Repository;
  index?: number;
}

export const ProjectCard = ({ repo, index = 0 }: ProjectCardProps) => {
  if (!repo) return null;

  const projectPath = `/projects/${repo.name}`;
  const category = getProjectCategory(repo);
  const cleanName = repo.name.replace(/[-_]/g, " ");

  const categoryLabel =
    category === "fullstack"
      ? "FULL STACK"
      : category === "frontend"
      ? "FRONTEND"
      : "BACKEND";

  const metaParts = [
    categoryLabel,
    repo.language ? repo.language.toUpperCase() : null,
  ].filter(Boolean);

  const metadataLine = metaParts.join(" · ");
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <article className="more-work-row">
      <div className="more-work-index" aria-hidden="true">
        {formattedIndex}
      </div>

      <div className="more-work-main">
        <div className="more-work-header">
          <h4 className="more-work-title">
            <Link to={projectPath} className="more-work-title-link">
              {cleanName}
            </Link>
          </h4>
          <span className="more-work-meta-line">{metadataLine}</span>
        </div>

        {repo.description ? (
          <p className="more-work-description">{repo.description}</p>
        ) : null}
      </div>

      <div className="more-work-actions">
        <Link
          to={projectPath}
          className="more-work-action more-work-action--details"
          aria-label={`View details for ${cleanName}`}
        >
          <span>DETAILS</span>
          <span className="more-work-arrow" aria-hidden="true">→</span>
        </Link>
        {repo.html_url && repo.showGitHub !== false && (
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="more-work-action more-work-action--github"
            aria-label={`View ${cleanName} on GitHub (opens in new tab)`}
          >
            <span>GITHUB</span>
            <span className="more-work-arrow" aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
};


