import { CONFIG } from '../../config';
import { ProjectsView } from '../../features/projects/components';

export function ProjectsPage() {
  return (
    <>
      <title>{`Projects | ${CONFIG.APP_NAME}`}</title>
      <ProjectsView />
    </>
  );
}

export { ProjectsPage as Component };
