import { useParams } from 'react-router-dom';
import { ProjectReader } from '@/modules/projects';
import '@/assets/styles/pages/ProjectDetailsPage.css';

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return <ProjectReader projectId={id} />;
};

export default ProjectDetailsPage;
