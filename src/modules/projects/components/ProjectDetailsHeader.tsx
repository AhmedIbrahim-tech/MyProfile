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
    showGitHub,
    imageUrl,
    githubData,
    techTags,
    role,
    caseStudy,
  } = project;

  const primaryStack =
    caseStudy?.techStack?.[0] ||
    githubData?.language ||
    (techTags[0]?.startsWith('Stack: ') ? techTags[0].replace('Stack: ', '') : techTags[0]) ||
    'Software Architecture';

  let eyebrowText = 'CASE STUDY // PROJECT';
  let tierModifier = 'project';
  if (caseStudy) {
    if (caseStudy.portfolioTier === 'flagship') {
      eyebrowText = 'CASE STUDY // FLAGSHIP';
      tierModifier = 'flagship';
    } else {
      eyebrowText = 'CASE STUDY // ADDITIONAL CASE STUDY';
      tierModifier = 'selected';
    }
  } else {
    eyebrowText = 'REPOSITORY // MORE WORK';
    tierModifier = 'archive';
  }

  return (
    <header className="case-study-header">
      {/* Editorial Navigation Strip */}
      <div className="case-study-nav-strip">
        <Link to="/projects" className="case-study-back-link">
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
          <span>Back to Projects</span>
        </Link>
        <div className={`case-study-eyebrow-pill ${tierModifier}`}>
          <span>{eyebrowText}</span>
        </div>
      </div>

      {/* Editorial Intro */}
      <div className="case-study-intro-block">
        <div className="case-study-category-line">
          <span className={`case-study-category-badge ${(category || 'fullstack').toLowerCase()}`}>
            {category || 'FullStack'}
          </span>
          {githubData?.name && showGitHub !== false ? (
            <span className="case-study-repo-slug">
              ahmedibrahim-tech / {githubData.name}
            </span>
          ) : (
            <span className="case-study-repo-slug">Featured System</span>
          )}
        </div>

        <h1 className="case-study-title">{name}</h1>
        <p className="case-study-lead">{finalNarrative}</p>

        {/* Compact Technical Metadata Bar */}
        <div className="case-study-meta-strip">
          {role && (
            <div className="meta-strip-item">
              <span className="meta-strip-label">ROLE</span>
              <span className="meta-strip-value">{role}</span>
            </div>
          )}
          <div className="meta-strip-item">
            <span className="meta-strip-label">CATEGORY</span>
            <span className="meta-strip-value">{category || 'FullStack'}</span>
          </div>
          <div className="meta-strip-item">
            <span className="meta-strip-label">PRIMARY STACK</span>
            <span className="meta-strip-value">{primaryStack}</span>
          </div>
          <div className="meta-strip-item">
            <span className="meta-strip-label">ACCESS</span>
            <span className="meta-strip-value">
              {githubUrl && showGitHub !== false ? 'Public Source' : 'Curated Production System'}
            </span>
          </div>
        </div>

        {/* Editorial Action Buttons */}
        <div className="case-study-actions">
          {liveDemoUrl && (
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-case-study primary"
            >
              <span>Live Project</span>
              <i className="fas fa-external-link-alt" aria-hidden="true"></i>
            </a>
          )}
          {githubUrl && showGitHub !== false && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-case-study secondary"
            >
              <i className="fab fa-github" aria-hidden="true"></i>
              <span>View Source</span>
            </a>
          )}
          <Link to="/projects" className="btn-case-study back-cta">
            <span>← Back to Projects</span>
          </Link>
        </div>
      </div>

      {/* Hero Visual: Flat, Clean Editorial Image Framing */}
      <div className="case-study-hero-frame">
        <img
          src={imageUrl}
          alt={`${name} overview`}
          className="case-study-hero-image"
          loading="eager"
        />
      </div>
    </header>
  );
};

export default ProjectDetailsHeader;
