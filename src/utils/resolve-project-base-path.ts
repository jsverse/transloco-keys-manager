import { cosmiconfigSync } from 'cosmiconfig';

import { ProjectType } from '../config';

export function resolveProjectBasePath(projectName?: string): {
  projectBasePath: string;
  projectType: ProjectType;
} {
  const result = cosmiconfigSync('angular', {
    searchPlaces: ['angular.json', '.angular.json'],
  }).search();
  let sourceRoot = 'src';
  let projectType;
  const config = result?.config;
  if (config) {
    projectName = projectName || config.defaultProject;
    const project = config.projects[projectName];
    if (project) {
      sourceRoot = project.sourceRoot;
      projectType = project.projectType;
    }
  }

  return { projectBasePath: sourceRoot, projectType };
}
