import { cosmiconfigSync } from 'cosmiconfig';

import { ProjectType } from '../defaultConfig';

type ProjectBasePath = { projectBasePath: string; projectType: ProjectType };

export function resolveProjectBasePath(projectName?: string): ProjectBasePath {
  const result = cosmiconfigSync('angular', { searchPlaces: ['angular.json', '.angular.json'] }).search();
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
