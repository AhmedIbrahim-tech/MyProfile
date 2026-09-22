// Public API of the Projects Module

export { default as Projects, ProjectsList, ProjectsList as default } from './components/ProjectsList';
export { ProjectCard } from './components/ProjectCard';
export { TopProjectCard } from './components/TopProjectCard';
export { ProjectFilters, type FilterCategory } from './components/ProjectFilters';
export { ProjectReader, type ProjectReaderProps } from './components/ProjectReader';
export { ProjectDetailsHeader, type ProjectDetailsHeaderProps } from './components/ProjectDetailsHeader';
export { ProjectTechStack, type ProjectTechStackProps } from './components/ProjectTechStack';
export { ProjectMetrics, type ProjectMetricsProps } from './components/ProjectMetrics';
export { TechnicalDetails, type TechnicalDetailsProps } from './components/TechnicalDetails';
export { ProjectSidebar, type ProjectSidebarProps } from './components/ProjectSidebar';

// Hooks
export { useRepositories } from './hooks/useRepositories';
export { useProjectGitHubData } from './hooks/useProjectGitHubData';
export { useProjectDetails } from './hooks/useProjectDetails';

// Services
export { githubService } from './services/githubService';

// Utilities
export { parseAdvancedReadme } from './utils/readmeParser';
export { inferTechnicalDetails } from './utils/inferTechnicalDetails';
export { getProjectCategory, getTopProjectCategory } from './utils/projectCategory';
export { generateDescription } from './utils/projectDescription';
export { generateFeatures } from './utils/projectFeatures';
export { getTechnologyTags, getTopProjectTags } from './utils/technologyTags';
export { isRepoHidden } from './utils/repoFilter';

// Constants
export { getProjectImage } from './constants/projectImages';

// Types
export type * from './types';
