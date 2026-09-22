import type { TeamMember } from '../types';

export interface ProjectSidebarProps {
  teamMembers: TeamMember[];
  role?: string;
  contribution?: string;
}

export const ProjectSidebar = ({
  teamMembers,
  role,
  contribution,
}: ProjectSidebarProps) => {
  const showContribution = teamMembers.length > 1 && (role || contribution);

  return (
    <div className="dashboard-column sidebar">
      {showContribution && (
        <section className="dashboard-section-card compact">
          <div className="section-card-header">
            <i className="fas fa-user-circle"></i>
            <h3>My Contribution</h3>
          </div>
          <div className="role-showcase">
            <span className="role-title">{role || 'Lead Developer'}</span>
            {contribution && <p className="role-description">{contribution}</p>}
          </div>
        </section>
      )}

      <section className="dashboard-section-card compact">
        <div className="section-card-header">
          <i className="fas fa-users"></i>
          <h3>Development Team</h3>
        </div>
        <div className="team-vertical-list">
          {teamMembers.map((member: TeamMember, i: number) => (
            <div key={i} className="team-member-item">
              <div className="member-avatar">{member.name[0]}</div>
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectSidebar;
