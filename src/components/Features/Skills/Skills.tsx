import { profileData } from '../../../data/profileData';
import './Skills.css';
import * as Si from 'react-icons/si';
import * as Fa from 'react-icons/fa';

const getSkillIcon = (skill: string) => {
  const skillLower = skill.toLowerCase();
  
  if (skillLower.includes('typescript') || skillLower.includes('ts')) return Si.SiTypescript;
  if (skillLower.includes('javascript') || skillLower.includes('js')) return Si.SiJavascript;
  if (skillLower.includes('c#') || skillLower.includes('csharp')) return Si.SiSharp;
  if (skillLower.includes('.net') || skillLower.includes('asp.net')) return Si.SiDotnet;
  if (skillLower.includes('angular')) return Si.SiAngular;
  
  if (skillLower.includes('next.js') || skillLower.includes('next')) return Si.SiNextdotjs;
  if (skillLower.includes('react.js') || skillLower.includes('react')) return Si.SiReact;
  if (skillLower.includes('vite')) return Si.SiVite;
  if (skillLower.includes('redux') || skillLower.includes('state management')) return Si.SiRedux;
  if (skillLower.includes('jquery')) return Si.SiJquery;
  if (skillLower.includes('material ui')) return Si.SiMui;
  if (skillLower.includes('ant design')) return Si.SiMui;
  
  if (skillLower.includes('tailwind css') || skillLower.includes('tailwind')) return Si.SiTailwindcss;
  if (skillLower.includes('bootstrap framework') || skillLower.includes('bootstrap')) return Si.SiBootstrap;
  if (skillLower.includes('html')) return Si.SiHtml5;
  if (skillLower.includes('css') && !skillLower.includes('scss') && !skillLower.includes('sass') && !skillLower.includes('tailwind')) return Si.SiCss3;
  if (skillLower.includes('sass') || skillLower.includes('scss')) return Si.SiSass;
  
  if (skillLower.includes('entity framework core') || skillLower.includes('entity framework') || skillLower.includes('ef core')) return Si.SiDotnet;
  if (skillLower.includes('microsoft sql') || skillLower.includes('sql server')) return Fa.FaDatabase;
  if (skillLower.includes('dapper') || skillLower.includes('orm')) return Fa.FaDatabase;
  if (skillLower.includes('sql') || skillLower.includes('database')) return Fa.FaDatabase;
  if (skillLower.includes('linq')) return Fa.FaDatabase;
  
  if (skillLower.includes('api') || skillLower.includes('restful') || skillLower.includes('minimal api')) return Fa.FaPlug;
  if (skillLower.includes('signalr') || skillLower.includes('websocket') || skillLower.includes('real-time')) return Fa.FaBroadcastTower;
  if (skillLower.includes('postman')) return Si.SiPostman;
  if (skillLower.includes('payment') || skillLower.includes('gateway')) return Fa.FaCreditCard;
  
  if (skillLower.includes('github')) return Si.SiGithub;
  if (skillLower.includes('git') || skillLower.includes('azure devops') || skillLower.includes('version control')) return Si.SiGithub;
  if (skillLower.includes('docker')) return Si.SiDocker;
  if (skillLower.includes('ci/cd') || skillLower.includes('pipeline')) return Fa.FaTasks;
  
  if (skillLower.includes('architecture') || skillLower.includes('microservices') || skillLower.includes('clean architecture')) return Fa.FaSitemap;
  if (skillLower.includes('pattern') || skillLower.includes('repository') || skillLower.includes('cqrs') || skillLower.includes('mediator') || skillLower.includes('solid')) return Fa.FaProjectDiagram;
  if (skillLower.includes('design pattern')) return Fa.FaShapes;
  
  if (skillLower.includes('serilog')) return Fa.FaFileAlt;
  if (skillLower.includes('fluentvalidation') || skillLower.includes('fluent validation')) return Fa.FaCheckCircle;
  if (skillLower.includes('mediatr') || skillLower.includes('mediator')) return Fa.FaExchangeAlt;
  if (skillLower.includes('automapper') || skillLower.includes('auto mapper')) return Fa.FaSyncAlt;
  if (skillLower.includes('swagger') || skillLower.includes('openapi')) return Fa.FaBookOpen;
  if (skillLower.includes('jwt') || skillLower.includes('authentication')) return Fa.FaKey;
  if (skillLower.includes('identity framework') || skillLower.includes('identity')) return Fa.FaUserShield;
  if (skillLower.includes('redis')) return Si.SiRedis;
  if (skillLower.includes('rabbitmq') || skillLower.includes('rabbit mq')) return Fa.FaExchangeAlt;
  if (skillLower.includes('hangfire')) return Fa.FaClock;
  if (skillLower.includes('xunit') || skillLower.includes('moq') || skillLower.includes('unit test')) return Fa.FaVial;
  
  if (skillLower.includes('agile') || skillLower.includes('scrum')) return Fa.FaUsers;
  if (skillLower.includes('testing') || skillLower.includes('integration test')) return Fa.FaVial;
  if (skillLower.includes('performance') || skillLower.includes('optimization')) return Fa.FaTachometerAlt;
  
  return Fa.FaCode;
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
                {category.skills.map((skill, skillIndex) => {
                  const IconComponent = getSkillIcon(skill);
                  return (
                    <div key={skillIndex} className="skill-card">
                      <div className="skill-icon">
                        <IconComponent />
                      </div>
                      <span className="skill-name">{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

