import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';

import { ProjectType } from '../defaultConfig';

type ProjectBasePath = { projectBasePath: string; projectType: ProjectType };

const defaultWorkspaceConfigPaths = ['angular.json', '.angular.json'];

export function resolveProjectBasePath(projectName?: string, workspaceConfigPath?: string): ProjectBasePath {
  const searchPlaces = workspaceConfigPath ? [workspaceConfigPath] : defaultWorkspaceConfigPaths;
  const result = cosmiconfigSync('angular', { searchPlaces }).search();
  let sourceRoot = 'src';
  let projectType: ProjectType;
  const config = result?.config;
  if (config) {
    projectName = projectName || config.defaultProject;
    const project = config.projects[projectName];
    if (project) {
      sourceRoot = project.sourceRoot;
      projectType = project.projectType;
    }
  } else {
    console.log(
      chalk.black.bgRed(
        `Unable to load workspace config from ${searchPlaces.join(', ')}. Defaulting source root to '${sourceRoot}'`
      )
    );
  }

  return { projectBasePath: sourceRoot, projectType };
}
