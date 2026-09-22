export interface ProjectTechStackProps {
  techTags: string[];
}

export const ProjectTechStack = ({ techTags }: ProjectTechStackProps) => {
  if (techTags.length === 0) return null;

  return (
    <section className="tech-dashboard-bar">
      <div className="bar-label">Infrastructure & Stack</div>
      <div className="tech-scroller">
        {techTags.map((tag: string, i: number) => {
          const parts = tag.split(': ');
          return (
            <div key={i} className="tech-badge-premium">
              {parts.length > 1 ? (
                <>
                  <span className="badge-label">{parts[0]}</span>
                  <span className="badge-value">{parts[1]}</span>
                </>
              ) : (
                tag
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectTechStack;
