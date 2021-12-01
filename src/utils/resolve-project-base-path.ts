import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';

import { ProjectType } from '../config';

import { isObject, isString } from './validators.utils';

const angularConfig = ['angular.json', '.angular.json'];
const workspaceConfig = ['workspace.json'];
const projectConfig = ['project.json'];
const sourceRootDefault = 'src';

function searchConfig(searchPlaces: string[], searchFrom = '') {
  return cosmiconfigSync('', { searchPlaces }).search(searchFrom)?.config;
}

function defaultWithError(places: string): {
  projectBasePath: string;
  projectType: ProjectType;
} {
  console.log(
    chalk.black.bgRed(
      `Unable to load workspace config from ${places}. Defaulting source root to '${sourceRootDefault}'`
    )
  );
  return { projectBasePath: sourceRootDefault, projectType: undefined };
}

export function resolveProjectBasePath(projectName?: string): {
  projectBasePath: string;
  projectType: ProjectType;
} {
  const angular = searchConfig(angularConfig);
  const workspace = searchConfig(workspaceConfig);
  const config = workspace || angular;
  if (!config) {
    const searchPlaces = angularConfig.concat(workspaceConfig).join(', ');
    return defaultWithError(searchPlaces);
  }

  const name = projectName || config.defaultProject;
  const project = config.projects?.[name];
  if (project) {
    if (isObject(project)) {
      return {
        projectBasePath: project.sourceRoot,
        projectType: project.projectType,
      };
    }
    if (isString(project)) {
      const pConfig = searchConfig(projectConfig, project);
      if (pConfig) {
        return {
          projectBasePath: pConfig.sourceRoot,
          projectType: pConfig.projectType,
        };
      }
    }
  }

  return defaultWithError(projectConfig[0]);
}
