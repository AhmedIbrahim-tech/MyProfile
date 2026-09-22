import { profileData } from '@/data/profileData';
import { EducationIcon } from '@/shared/components/icons';
import '@/assets/styles/features/Education.css';

// Graduation project component
const GraduationProject = ({
  project,
  description,
}: {
  project: string;
  description: string;
}) => (
  <div className="graduation-project">
    <h4>
      <span className="project-label">Graduation Project:</span> {project}
    </h4>
    <p>{description}</p>
  </div>
);

// Education card component
const EducationCard = () => {
  const { institution, degree, grade, project, projectDescription } = profileData.education;

  return (
    <article className="education-card">
      <div className="education-icon" aria-hidden="true">
        <EducationIcon />
      </div>

      <div className="education-content">
        <h3>{institution}</h3>
        <p className="education-degree">{degree}</p>
        <p className="education-grade">
          <span className="grade-label">Overall Grade:</span> {grade}
        </p>

        <GraduationProject project={project} description={projectDescription} />
      </div>
    </article>
  );
};

export const EducationSection = () => {
  return (
    <section className="education" id="education" aria-labelledby="education-title">
      <div className="education-container">
        <h2 className="section-title" id="education-title">
          <i className="fas fa-graduation-cap" aria-hidden="true"></i>
          <span>
            Explore My <strong>Education</strong>
          </span>
        </h2>

        <EducationCard />
      </div>
    </section>
  );
};

export default EducationSection;
