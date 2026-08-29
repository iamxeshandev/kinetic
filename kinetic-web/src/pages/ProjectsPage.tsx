import { config } from '../config';
import { ProjectsView } from '../features/projects/components';

export function Component() {
  return (
    <>
      <title>{`Projects | ${config.appName}`}</title>
      <ProjectsView />
    </>
  );
}
