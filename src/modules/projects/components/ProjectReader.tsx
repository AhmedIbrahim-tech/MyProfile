import { Link } from 'react-router-dom';
import Loading from '@/shared/components/feedback/Loading';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { ProjectDetailsHeader } from './ProjectDetailsHeader';
import { ProjectTechStack } from './ProjectTechStack';
import { ProjectMetrics } from './ProjectMetrics';
import { TechnicalDetails } from './TechnicalDetails';
import { ProjectSidebar } from './ProjectSidebar';
import { ProjectNavigation } from './ProjectNavigation';

export interface ProjectReaderProps {
  projectId?: string;
}

export const ProjectReader = ({ projectId }: ProjectReaderProps) => {
  const { projectDetails, loading, error } = useProjectDetails(projectId);

  // Guard Clauses for early returns
  if (loading) {
    return <Loading message="Loading Project Details..." size="lg" />;
  }

  if (error || !projectDetails) {
    return (
      <main className="case-study-page">
        <div className="case-study-container">
          <div className="case-study-not-found">
            <span className="section-eyebrow">UNAVAILABLE</span>
            <h1 className="not-found-title">Project Unavailable</h1>
            <p className="not-found-text">{error || 'The requested project could not be found.'}</p>
            <Link to="/projects" className="btn-case-study primary">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { caseStudy } = projectDetails;

  // Dynamic consecutive numbering for available sections
  let counter = 1;
  const hasPurpose = Boolean(projectDetails.purpose);
  const purposeNumber = hasPurpose ? String(counter++).padStart(2, '0') : undefined;

  const hasRole = Boolean(projectDetails.role || projectDetails.contribution);
  const roleNumber = hasRole ? String(counter++).padStart(2, '0') : undefined;

  const hasArchitecture = projectDetails.architecture.length > 0;
  const archNumber = hasArchitecture ? String(counter++).padStart(2, '0') : undefined;

  const hasFeatures = projectDetails.features.length > 0;
  const featNumber = hasFeatures ? String(counter++).padStart(2, '0') : undefined;

  const hasChallenges = projectDetails.challenges.length > 0;
  const chalNumber = hasChallenges ? String(counter++).padStart(2, '0') : undefined;

  const outcomeText = projectDetails.outcome || caseStudy?.outcome;
  const hasOutcome = Boolean(outcomeText);
  const outcomeNumber = hasOutcome ? String(counter++).padStart(2, '0') : undefined;

  return (
    <main className="case-study-page">
      <article className="case-study-container">
        {/* 1 & 2. Case Study Header & Overview Metadata & Hero Visual */}
        <ProjectDetailsHeader project={projectDetails} />

        {/* Main Document Flow */}
        <div className="case-study-body">
          {/* Project Purpose / Product Context */}
          {hasPurpose && (
            <section className="case-study-section purpose-section" aria-labelledby="section-purpose-title">
              <div className="case-study-section-header">
                <span className="section-eyebrow">{purposeNumber} — PROJECT CONTEXT</span>
                <h2 id="section-purpose-title" className="case-study-section-title">
                  Project Purpose & Direction
                </h2>
              </div>
              <div className="case-study-purpose-content">
                <p className="case-study-purpose-narrative">{projectDetails.purpose}</p>
              </div>
            </section>
          )}

          {/* My Role / Contribution */}
          {hasRole && (
            <section className="case-study-section role-section" aria-labelledby="section-role-title">
              <div className="case-study-section-header">
                <span className="section-eyebrow">{roleNumber} — MY ROLE</span>
                {projectDetails.role && (
                  <h2 id="section-role-title" className="case-study-role-headline">
                    {projectDetails.role}
                  </h2>
                )}
              </div>
              {projectDetails.contribution && (
                <div className="case-study-role-content">
                  <p className="case-study-role-narrative">{projectDetails.contribution}</p>
                </div>
              )}
            </section>
          )}

          {/* Technology Stack */}
          <ProjectTechStack techTags={projectDetails.techTags} />

          {/* Architecture & Engineering, Key Features, Engineering Challenges */}
          <TechnicalDetails
            architecture={projectDetails.architecture}
            features={projectDetails.features}
            challenges={projectDetails.challenges}
            archNumber={archNumber}
            featNumber={featNumber}
            chalNumber={chalNumber}
          />

          {/* Outcome / Delivered Scope & Status */}
          {hasOutcome && (
            <section className="case-study-section outcome-section" aria-labelledby="section-outcome-title">
              <div className="case-study-section-header">
                <span className="section-eyebrow">{outcomeNumber} — DELIVERED SCOPE & STATUS</span>
                <h2 id="section-outcome-title" className="case-study-section-title">
                  Delivered Scope & Current Status
                </h2>
              </div>
              <div className="case-study-outcome-card">
                <p className="case-study-outcome-text">{outcomeText}</p>
              </div>
            </section>
          )}

          {/* 9. Verified Metrics (Subordinate, only if explicitly parsed) */}
          <ProjectMetrics metrics={projectDetails.metrics} />

          {/* 10. Project Team & Repository Contributors */}
          <ProjectSidebar
            teamMembers={projectDetails.teamMembers}
            contributors={projectDetails.showGitHub !== false ? projectDetails.contributors : []}
          />

          {/* 11. Curated Previous / Next Navigation */}
          <ProjectNavigation currentProject={caseStudy} />

          {/* Bottom Back to Projects */}
          <div className="case-study-bottom-nav">
            <Link to="/projects" className="case-study-bottom-back">
              <i className="fas fa-arrow-left" aria-hidden="true"></i>
              <span>Back to Projects Overview</span>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
};

export default ProjectReader;
