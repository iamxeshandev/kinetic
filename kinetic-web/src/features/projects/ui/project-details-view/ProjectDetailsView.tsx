import type { Project } from '../../types';

export type ProjectDetailsViewProps = {
  project: Project;
};

export function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  return <h1>{project.name}</h1>;
}
