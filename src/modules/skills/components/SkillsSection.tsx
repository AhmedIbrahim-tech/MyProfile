import { profileData } from '@/data/profileData';
import type { SkillCategory } from '@/modules/skills/types';
import {
  TECH_LIB_FAMILIAR_ICONS,
  getSkillIcon,
  skillIconSvgClass,
} from '@/modules/skills/constants/iconRegistry';
import '@/assets/styles/features/Skills.css';

export const SkillsSection = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Back End',
      icon: 'fas fa-server',
      skills: profileData.technologies.backEnd,
    },
    {
      title: 'Front End',
      icon: 'fas fa-desktop',
      skills: profileData.technologies.frontEnd,
    },
    {
      title: 'Technical Knowledge',
      icon: 'fas fa-cogs',
      skills: profileData.technologies.technicalKnowledge,
    },
    {
      title: 'Libraries & Technologies',
      icon: 'fas fa-book',
      skills: profileData.technologies.libraries,
    },
    {
      title: 'Familiar With',
      icon: 'fas fa-star',
      skills: profileData.technologies.familiarWith,
    },
  ];

  return (
    <section className="skills" id="skills">
      <div className="skills-container">
        <h2 className="section-title">
          <i className="fas fa-lightbulb"></i>
          <span>
            Some of My <strong>Skills</strong>
          </span>
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
                  const ReactIcon = TECH_LIB_FAMILIAR_ICONS[skill];
                  if (ReactIcon) {
                    return (
                      <div key={skillIndex} className="skill-card">
                        <div className="skill-icon">
                          <ReactIcon className="skill-icon-ri" aria-hidden />
                        </div>
                        <span className="skill-name">{skill}</span>
                      </div>
                    );
                  }
                  const IconComponent = getSkillIcon(skill);
                  return (
                    <div key={skillIndex} className="skill-card">
                      <div className="skill-icon">
                        <IconComponent className={skillIconSvgClass(skill)} aria-hidden />
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

export default SkillsSection;
