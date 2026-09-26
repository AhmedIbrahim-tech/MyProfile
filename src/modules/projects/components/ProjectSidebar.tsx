import type { GitHubContributor, TeamMember } from '../types';

export interface ProjectSidebarProps {
  teamMembers?: TeamMember[];
  contributors?: GitHubContributor[];
}

export const ProjectSidebar = ({
  teamMembers = [],
  contributors = [],
}: ProjectSidebarProps) => {
  const showTeamSection = teamMembers.length > 0;
  const showContributorsSection = contributors.length > 0;

  if (!showTeamSection && !showContributorsSection) {
    return null;
  }

  return (
    <section className="case-study-section team-contributors-section" aria-label="Team and Contributors">
      {/* Curated Professional Project Team */}
      {showTeamSection && (
        <div className="case-study-team-block">
          <div className="case-study-section-header">
            <span className="section-eyebrow">PROJECT TEAM</span>
            <h2 className="case-study-section-title">Engineering Collaborators</h2>
          </div>
          <div className="case-study-team-list">
            {teamMembers.map((member: TeamMember, i: number) => (
              <div key={i} className="team-row-item">
                <span className="team-member-name">{member.name}</span>
                <span className="team-member-divider">/</span>
                <span className="team-member-role">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Factual Repository Contributors (GitHub Metadata) */}
      {showContributorsSection && (
        <div className="case-study-contributors-block">
          <div className="case-study-section-header">
            <span className="section-eyebrow">REPOSITORY CONTRIBUTORS</span>
            <h3 className="contributors-subheading">Public Source Contributors</h3>
          </div>
          <div className="contributors-compact-grid">
            {contributors.map((c: GitHubContributor) => (
              <a
                key={c.login}
                href={`https://github.com/${c.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contributor-compact-item"
                title={`@${c.login} (${c.contributions} ${c.contributions === 1 ? 'contribution' : 'contributions'})`}
              >
                {c.avatar_url ? (
                  <img src={c.avatar_url} alt={c.login} className="contributor-avatar-small" />
                ) : (
                  <div className="contributor-avatar-fallback">{c.login[0]?.toUpperCase()}</div>
                )}
                <div className="contributor-meta-inline">
                  <span className="contributor-login">@{c.login}</span>
                  <span className="contributor-count">
                    {c.contributions} {c.contributions === 1 ? 'commit' : 'commits'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectSidebar;
