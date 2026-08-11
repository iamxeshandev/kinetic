import { config } from '../config';
import { ProjectsView } from '../features/projects';

export function Component() {
  return (
    <>
      <title>{`Projects | ${config.appName}`}</title>
      <ProjectsView />
    </>
  );
}
