import { Link } from 'react-router-dom';
import Loading from '@/shared/components/feedback/Loading';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { ProjectDetailsHeader } from './ProjectDetailsHeader';
import { ProjectTechStack } from './ProjectTechStack';
import { ProjectMetrics } from './ProjectMetrics';
import { TechnicalDetails } from './TechnicalDetails';
import { ProjectSidebar } from './ProjectSidebar';

export interface ProjectReaderProps {
  projectId?: string;
}

export const ProjectReader = ({ projectId }: ProjectReaderProps) => {
  const { projectDetails, loading, error } = useProjectDetails(projectId);

  // Guard Clauses for early returns
  if (loading) {
    return <Loading message="Initialising Technical Dashboard..." size="lg" />;
  }

  if (error || !projectDetails) {
    return (
      <div className="project-details-not-found">
        <h2>Project Not Found</h2>
        <p>{error || 'The project you are looking for does not exist on GitHub.'}</p>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const { caseStudy } = projectDetails;

  return (
    <div className="project-details-page premium-theme">
      <div className="project-details-container">
        <ProjectDetailsHeader project={projectDetails} />

        {/* Technical Dashboard Body */}
        <div className="dashboard-body">
          {/* Tech Stack Horizontal Dashboard */}
          <ProjectTechStack techTags={projectDetails.techTags} />

          {/* Metrics Dashboard */}
          <ProjectMetrics metrics={projectDetails.metrics} />

          <div className="main-dashboard-grid">
            {/* Column 1: Technical Deep Dive */}
            <TechnicalDetails
              architecture={projectDetails.architecture}
              features={projectDetails.features}
              challenges={projectDetails.challenges}
            />

            {/* Column 2: Insights & Roles */}
            <ProjectSidebar
              teamMembers={projectDetails.teamMembers}
              role={caseStudy?.role}
              contribution={caseStudy?.contribution}
            />
          </div>

          {/* Outcome Footer Banner */}
          {caseStudy?.outcome && (
            <footer className="outcome-premium-footer">
              <div className="outcome-inner">
                <div className="outcome-icon-large">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="outcome-text-group">
                  <h4>Delivery & Impact</h4>
                  <p>{caseStudy.outcome}</p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectReader;
