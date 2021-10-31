import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';

import { ProjectType } from '../config';

const angularConfig = ['angular.json', '.angular.json'];
const workspaceConfig = ['workspace.json'];

function searchConfig(searchPlaces: string[]) {
  return cosmiconfigSync('', { searchPlaces }).search()?.config;
}

export function resolveProjectBasePath(projectName?: string): {
  projectBasePath: string;
  projectType: ProjectType;
} {
  const angular = searchConfig(angularConfig);
  const workspace = searchConfig(workspaceConfig);
  let sourceRoot = 'src';
  let projectType;

  for (const config of [angular, workspace]) {
    if (config) {
      projectName = projectName || config.defaultProject;
      const project = config.projects?.[projectName];
      if (project) {
        sourceRoot = project.sourceRoot;
        projectType = project.projectType;
        break;
      }
    }
  }

  if (!angular && !workspace) {
    const searchPlaces = angularConfig.concat(workspaceConfig);
    console.log(
      chalk.black.bgRed(
        `Unable to load workspace config from ${searchPlaces.join(
          ', '
        )}. Defaulting source root to '${sourceRoot}'`
      )
    );
  }

  return { projectBasePath: sourceRoot, projectType };
}
