import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import path from 'path';

import { ProjectType } from '../config';

import { coerceArray } from './collection.utils';
import { isString } from './validators.utils';

const angularConfigFile = ['angular.json', '.angular.json'];
const workspaceConfigFile = 'workspace.json';
const projectConfigFile = 'project.json';
const defaultSourceRoot = 'src';

function searchConfig(searchPlaces: string[] | string, searchFrom = '') {
  const resolvePath = path.resolve(process.cwd(), searchFrom);

  return cosmiconfigSync('', {
    searchPlaces: coerceArray(searchPlaces),
  }).search(resolvePath)?.config;
}

function logNotFound(searchPlaces: string[]) {
  console.log(
    chalk.black.bgRed(
      `Unable to load workspace config from ${searchPlaces.join(
        ', '
      )}. Defaulting source root to '${defaultSourceRoot}'`
    )
  );
}

export function resolveProjectBasePath(projectName?: string): {
  projectBasePath: string;
  projectType?: ProjectType;
} {
  const angular = searchConfig(angularConfigFile);
  const workspace = searchConfig(workspaceConfigFile);

  if (!angular && !workspace) {
    logNotFound([...angularConfigFile, workspaceConfigFile]);

    return { projectBasePath: defaultSourceRoot };
  }

  let sourceRoot: string;
  let projectType: ProjectType;

  for (const config of [angular, workspace]) {
    if (config) {
      projectName = projectName || config.defaultProject;
      const project = config.projects?.[projectName];
      const projectConfig = isString(project)
        ? searchConfig(projectConfigFile, project)
        : project;

      if (projectConfig) {
        sourceRoot = projectConfig.sourceRoot;
        projectType = projectConfig.projectType;
        break;
      }
    }
  }

  return { projectBasePath: sourceRoot, projectType };
}
