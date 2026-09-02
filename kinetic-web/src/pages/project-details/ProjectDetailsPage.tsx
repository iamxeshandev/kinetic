import { useParams } from 'react-router';
import { CONFIG } from '../../config';
import { useProject } from '../../features/projects/hooks';
import { ProjectDetailsView } from '../../features/projects/ui';
import { LoadingScreen } from '../../shared/components/ui';

export function ProjectDetailsPage() {
  const { workspaceId, projectId } = useParams();

  const {
    data: project,
    isLoading,
    error,
  } = useProject(workspaceId!, projectId!);

  if (isLoading)
    return (
      <>
        <title>{`Loading... | ${CONFIG.APP_NAME}`}</title>
        <LoadingScreen />
      </>
    );

  if (error || !project)
    return (
      <>
        <title>{`Error | ${CONFIG.APP_NAME}`}</title>
        <h1>Error</h1>
      </>
    );

  return (
    <>
      <title>{`${project.name} | ${CONFIG.APP_NAME}`}</title>
      <ProjectDetailsView project={project} />
    </>
  );
}

export { ProjectDetailsPage as Component };
