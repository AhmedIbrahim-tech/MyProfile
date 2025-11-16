import { profileData } from '../../../data/profileData';
import './Skills.css';

// Skill icon mapping - matching image style
const getSkillIcon = (skill: string) => {
  const skillLower = skill.toLowerCase();
  
  // Programming Languages - using brand icons
  if (skillLower.includes('typescript') || skillLower.includes('ts')) return 'fab fa-js-square';
  if (skillLower.includes('javascript') || skillLower.includes('js')) return 'fab fa-js-square';
  if (skillLower.includes('c#') || skillLower.includes('csharp') || skillLower.includes('.net') || skillLower.includes('asp.net')) return 'fab fa-microsoft';
  if (skillLower.includes('angular')) return 'fab fa-angular';
  
  // Frontend Frameworks & Libraries
  if (skillLower.includes('react')) return 'fab fa-react';
  if (skillLower.includes('next')) return 'fab fa-react';
  if (skillLower.includes('jquery')) return 'fab fa-js-square';
  if (skillLower.includes('material ui') || skillLower.includes('ant design')) return 'fas fa-palette';
  
  // Markup & Styling - brand icons
  if (skillLower.includes('html')) return 'fab fa-html5';
  if (skillLower.includes('css') && !skillLower.includes('scss') && !skillLower.includes('sass')) return 'fab fa-css3-alt';
  if (skillLower.includes('bootstrap')) return 'fab fa-bootstrap';
  if (skillLower.includes('tailwind')) return 'fab fa-css3-alt';
  if (skillLower.includes('sass') || skillLower.includes('scss')) return 'fab fa-sass';
  
  // Databases & ORMs
  if (skillLower.includes('sql') || skillLower.includes('database') || skillLower.includes('microsoft sql')) return 'fas fa-database';
  if (skillLower.includes('entity framework') || skillLower.includes('ef core')) return 'fas fa-database';
  if (skillLower.includes('dapper') || skillLower.includes('orm')) return 'fas fa-database';
  if (skillLower.includes('linq')) return 'fas fa-database';
  
  // APIs & Services
  if (skillLower.includes('api') || skillLower.includes('restful') || skillLower.includes('minimal api')) return 'fas fa-plug';
  if (skillLower.includes('signalr') || skillLower.includes('websocket') || skillLower.includes('real-time')) return 'fas fa-broadcast-tower';
  if (skillLower.includes('postman')) return 'fas fa-cloud';
  if (skillLower.includes('payment') || skillLower.includes('gateway')) return 'fas fa-credit-card';
  
  // Version Control & DevOps - brand icons
  if (skillLower.includes('git') || skillLower.includes('github') || skillLower.includes('azure devops') || skillLower.includes('version control')) return 'fab fa-github';
  if (skillLower.includes('docker')) return 'fab fa-docker';
  if (skillLower.includes('ci/cd') || skillLower.includes('pipeline')) return 'fas fa-tasks';
  
  // Architecture & Patterns
  if (skillLower.includes('architecture') || skillLower.includes('microservices') || skillLower.includes('clean architecture')) return 'fas fa-sitemap';
  if (skillLower.includes('pattern') || skillLower.includes('repository') || skillLower.includes('cqrs') || skillLower.includes('mediator') || skillLower.includes('solid')) return 'fas fa-project-diagram';
  if (skillLower.includes('design pattern')) return 'fas fa-shapes';
  
  // Libraries & Technologies
  if (skillLower.includes('serilog')) return 'fas fa-file-alt';
  if (skillLower.includes('fluentvalidation') || skillLower.includes('fluent validation')) return 'fas fa-check-circle';
  if (skillLower.includes('mediatr') || skillLower.includes('mediator')) return 'fas fa-exchange-alt';
  if (skillLower.includes('automapper') || skillLower.includes('auto mapper')) return 'fas fa-sync-alt';
  if (skillLower.includes('swagger') || skillLower.includes('openapi')) return 'fas fa-book-open';
  if (skillLower.includes('jwt') || skillLower.includes('authentication')) return 'fas fa-key';
  if (skillLower.includes('identity framework') || skillLower.includes('identity')) return 'fas fa-user-shield';
  if (skillLower.includes('redis')) return 'fas fa-memory';
  if (skillLower.includes('rabbitmq') || skillLower.includes('rabbit mq')) return 'fas fa-exchange-alt';
  if (skillLower.includes('hangfire')) return 'fas fa-clock';
  if (skillLower.includes('xunit') || skillLower.includes('moq') || skillLower.includes('unit test')) return 'fas fa-vial';
  
  // Methodologies & Practices
  if (skillLower.includes('agile') || skillLower.includes('scrum')) return 'fas fa-users';
  if (skillLower.includes('testing') || skillLower.includes('integration test')) return 'fas fa-vial';
  if (skillLower.includes('performance') || skillLower.includes('optimization')) return 'fas fa-tachometer-alt';
  
  // Default icon
  return 'fas fa-code';
};

const Skills = () => {
  const skillCategories = [
    {
      title: 'Back End',
      icon: 'fas fa-server',
      skills: profileData.technologies.backEnd
    },
    {
      title: 'Front End',
      icon: 'fas fa-desktop',
      skills: profileData.technologies.frontEnd
    },
    {
      title: 'Technical Knowledge',
      icon: 'fas fa-cogs',
      skills: profileData.technologies.technicalKnowledge
    },
    {
      title: 'Libraries & Technologies',
      icon: 'fas fa-book',
      skills: profileData.technologies.libraries
    },
    {
      title: 'Familiar With',
      icon: 'fas fa-star',
      skills: profileData.technologies.familiarWith
    }
  ];

  return (
    <section className="skills" id="skills">
      <div className="skills-container">
        <h2 className="section-title">
          <i className="fas fa-lightbulb"></i>
          <span>Some of My <strong>Skills</strong></span>
        </h2>
        
        <div className="skills-categories">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="skill-category-section">
              <h3 className="category-title">
                <i className={category.icon}></i>
                {category.title}
              </h3>
              <div className="skills-grid">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-card">
                    <div className="skill-icon">
                      <i className={getSkillIcon(skill)}></i>
                    </div>
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

