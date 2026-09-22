import Projects from '@/modules/projects';
import { sectionConfig } from '@/data/sectionConfig';
import '@/assets/styles/pages/ProjectsPage.css';

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

