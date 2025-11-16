import { profileData } from '../../../data/profileData';
import './Experience.css';

const Experience = () => {
  const getTechnologies = (exp: typeof profileData.experience[0] & { technologies?: string[] }) => {
    // If technologies are explicitly provided, use them
    if (exp.technologies && exp.technologies.length > 0) {
      return exp.technologies;
    }
    
    // Otherwise, auto-detect from title and responsibilities
    const techs: string[] = [];
    const titleLower = exp.title.toLowerCase();
    const responsibilities = exp.responsibilities.join(' ').toLowerCase();
    
    if (titleLower.includes('react') || responsibilities.includes('react')) {
      techs.push('React.js', 'TypeScript');
    }
    if (titleLower.includes('.net') || responsibilities.includes('.net')) {
      techs.push('.NET Core', 'C#');
    }
    if (responsibilities.includes('material ui') || responsibilities.includes('mui')) {
      techs.push('Material UI');
    }
    if (responsibilities.includes('sql')) {
      techs.push('SQL Server');
    }
    if (responsibilities.includes('git')) {
      techs.push('Git & GitHub');
    }
    if (responsibilities.includes('entity framework') || responsibilities.includes('ef core')) {
      techs.push('Entity Framework Core');
    }
    if (responsibilities.includes('dapper')) {
      techs.push('Dapper');
    }
    
    return techs.length > 0 ? techs : ['React.js', 'TypeScript', '.NET Core'];
  };

  const formatResponsibility = (responsibility: string) => {
    const keywords = ['React.js', 'React', 'Material UI', 'TypeScript', 'JavaScript', '.NET Core', 'ASP.NET', 'Entity Framework', 'SQL Server', 'Dapper', 'Git', 'GitHub', 'Agile', 'Scrum', 'MVC', 'API', 'RESTful', 'CI/CD', 'B2B', 'B2C', 'ERP', 'ORM'];
    
    let formatted = responsibility;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `**${keyword}**`);
    });
    
    return formatted.split('**').map((part, idx) => {
      if (keywords.some(k => part.toLowerCase() === k.toLowerCase())) {
        return <strong key={idx}>{part}</strong>;
      }
      return part;
    });
  };

  const renderExperienceCard = (exp: typeof profileData.experience[0], index: number, isCurrent: boolean) => (
    <div key={index} className={`experience-card ${isCurrent ? 'current-experience' : ''}`}>
      <div className="exp-header">
        {isCurrent && (
          <div className="current-badge">
            <i className="fas fa-circle"></i>
            Current Position
          </div>
        )}
        <h3 className="exp-title">{exp.company}</h3>
        <div className="exp-meta">
          <span className="exp-type">
            <i className="fas fa-briefcase"></i>
            {exp.period}
          </span>
          {exp.location && (
            <span className="exp-location">
              <i className="fas fa-map-marker-alt"></i>
              {exp.location}
            </span>
          )}
        </div>
      </div>
      
      <div className="exp-role">{exp.title}</div>
      
      <ul className="exp-responsibilities">
        {exp.responsibilities.map((responsibility, idx) => (
          <li key={idx} className="responsibility-item">
            {formatResponsibility(responsibility)}
          </li>
        ))}
      </ul>
      
      <div className="exp-technologies">
        <i className="fas fa-search"></i>
        <div className="tech-tags">
          {getTechnologies(exp).map((tech, idx) => (
            <span key={idx} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const currentExperience = profileData.experience.find(exp => exp.period.toLowerCase().includes('present'));
  const pastExperiences = profileData.experience.filter(exp => !exp.period.toLowerCase().includes('present'));

  return (
    <section className="experience" id="experience">
      <div className="experience-container">
        <h2 className="section-title">
          <i className="fas fa-briefcase"></i>
          <span>Explore My <strong>Experience</strong></span>
        </h2>
        
        {currentExperience && (
          <div className="current-experience-wrapper">
            {renderExperienceCard(currentExperience, 0, true)}
          </div>
        )}
        
        {pastExperiences.length > 0 && (
          <div className="experience-grid">
            {pastExperiences.map((exp, index) => 
              renderExperienceCard(exp, index + 1, false)
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;

