import Projects from '../../components/Projects/Projects';
import { sectionConfig } from '../../data/sectionConfig';
import './ProjectsPage.css';

const ProjectsPage = () => {
  if (!sectionConfig.projects) {
    return null;
  }

  return (
    <div className="projects-page">
      <Projects />
    </div>
  );
};

export default ProjectsPage;

