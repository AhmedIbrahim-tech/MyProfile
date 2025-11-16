import { profileData } from '../../../data/profileData';
import './Education.css';

// Education icon SVG component
const EducationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M20 5L5 12.5L20 20L35 12.5L20 5Z" fill="#7C3AED"/>
    <path d="M5 27.5V17.5L20 25L35 17.5V27.5L20 35L5 27.5Z" fill="#7C3AED" opacity="0.6"/>
  </svg>
);

// Graduation project component
const GraduationProject = ({ 
  project, 
  description 
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
        
        <GraduationProject 
          project={project} 
          description={projectDescription} 
        />
      </div>
    </article>
  );
};

const Education = () => {
  return (
    <section className="education" id="education" aria-labelledby="education-title">
      <div className="education-container">
        <h2 className="section-title" id="education-title">
          <i className="fas fa-graduation-cap" aria-hidden="true"></i>
          <span>Explore My <strong>Education</strong></span>
        </h2>
        
        <EducationCard />
      </div>
    </section>
  );
};

export default Education;

