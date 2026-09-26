export interface ProjectTechStackProps {
  techTags: string[];
}

export const ProjectTechStack = ({ techTags }: ProjectTechStackProps) => {
  if (techTags.length === 0) return null;

  return (
    <section className="case-study-section tech-stack-section" aria-labelledby="tech-stack-heading">
      <div className="case-study-section-header">
        <span className="section-eyebrow">TECHNOLOGY STACK</span>
        <h2 id="tech-stack-heading" className="case-study-section-title">
          Tools, Libraries & Infrastructure
        </h2>
      </div>
      <div className="case-study-tech-wrap">
        {techTags.map((tag: string, i: number) => {
          const cleanTag = tag.replace(/^Stack:\s*/i, '');
          return (
            <span key={i} className="tech-badge-editorial">
              {cleanTag}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectTechStack;
