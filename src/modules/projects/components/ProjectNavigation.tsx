import { Link } from 'react-router-dom';
import { profileData } from '@/data/profileData';
import type { TopProject } from '../types';

export interface ProjectNavigationProps {
  currentProject: TopProject | null;
}

export const ProjectNavigation = ({ currentProject }: ProjectNavigationProps) => {
  if (!currentProject) return null;

  const curatedList = profileData.projects;
  const currentIndex = curatedList.findIndex(
    (p) => p.id.toLowerCase() === currentProject.id.toLowerCase()
  );

  if (currentIndex === -1) return null;

  // Previous & Next navigation within curated portfolio projects
  const prevProject =
    currentIndex > 0 ? curatedList[currentIndex - 1] : curatedList[curatedList.length - 1];
  const nextProject =
    currentIndex < curatedList.length - 1 ? curatedList[currentIndex + 1] : curatedList[0];

  return (
    <nav className="case-study-nav-pagination" aria-label="Adjacent Case Studies">
      {prevProject && (
        <Link
          to={`/projects/${prevProject.id}`}
          className="case-study-nav-card prev"
          aria-label={`Previous case study: ${prevProject.name}`}
        >
          <span className="nav-direction-label">← PREVIOUS CASE STUDY</span>
          <span className="nav-project-name">{prevProject.name}</span>
        </Link>
      )}
      {nextProject && (
        <Link
          to={`/projects/${nextProject.id}`}
          className="case-study-nav-card next"
          aria-label={`Next case study: ${nextProject.name}`}
        >
          <span className="nav-direction-label">NEXT CASE STUDY →</span>
          <span className="nav-project-name">{nextProject.name}</span>
        </Link>
      )}
    </nav>
  );
};

export default ProjectNavigation;
