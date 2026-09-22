import { Link } from 'react-router-dom';
import type { ProjectDetails } from '../types';

export interface ProjectDetailsHeaderProps {
  project: ProjectDetails;
}

export const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
  const {
    name,
    category,
    finalNarrative,
    liveDemoUrl,
    githubUrl,
    imageUrl,
    githubData,
    techTags,
  } = project;

  const isDotNet =
    githubData?.language?.toLowerCase() === 'c#' ||
    techTags.some(t => t.toLowerCase().includes('.net'));
  const primaryStack = isDotNet ? '.NET Core' : githubData?.language || 'Mixed';

  return (
    <>
      {/* Navigation & Live Signal */}
      <div className="premium-nav-strip">
        <Link to="/projects" className="back-btn-minimal">
          <i className="fas fa-arrow-left"></i>
          <span>Back to Forge</span>
        </Link>
        <div className="live-status-pill">
          <span className="pulse-dot"></span>
          <span>Technical Insights Live</span>
        </div>
      </div>

      {/* Hero Section - Split Layout */}
      <section className="project-hero-split">
        <div className="hero-content-meta">
          <div className="project-brand">
            <span className="badge-tag-main">{category || 'FullStack'}</span>
            <span className="repo-name-mini">ahmedibrahim-tech / {githubData?.name}</span>
          </div>
          <h1 className="project-title-xl">{name}</h1>
          <p className="project-description-lg">{finalNarrative}</p>

          <div className="hero-cta-group">
            {liveDemoUrl && (
              <a
                href={liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow-primary"
              >
                <span>Live Project</span>
                <i className="fas fa-external-link-alt"></i>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-premium"
              >
                <i className="fab fa-github"></i>
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>

        <div className="hero-visual-dashboard">
          <div className="immersive-image-wrapper">
            <img src={imageUrl} alt={name} className="main-project-visual" />
            <div className="visual-overlay-glow"></div>
          </div>

          {/* Floating Glass Cards */}
          <div className="floating-meta-card tech-card">
            <i className="fas fa-terminal"></i>
            <div className="meta-content">
              <span className="meta-value">{primaryStack}</span>
              <span className="meta-label">Primary Stack</span>
            </div>
          </div>

          <div className="floating-meta-card stats-card">
            <div className="mini-stat">
              <i className="fas fa-star"></i>
              <span>{githubData?.stargazers_count ?? 0}</span>
            </div>
            <div className="mini-stat">
              <i className="fas fa-code-branch"></i>
              <span>{githubData?.forks_count ?? 0}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailsHeader;
