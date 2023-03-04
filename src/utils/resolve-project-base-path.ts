import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import glob from 'glob';
import path from 'path';

import { ProjectType } from '../config';

import { jsoncParser } from './json.utils';
import { coerceArray } from './collection.utils';
import { isString } from './validators.utils';

const angularConfigFile = ['angular.json', '.angular.json'];
const workspaceConfigFile = 'workspace.json';
const projectConfigFile = 'project.json';
const defaultSourceRoot = 'src';

function searchConfig(searchPlaces: string[] | string, searchFrom = '') {
  const cwd = process.cwd();
  const resolvePath = path.resolve(cwd, searchFrom);
  const stopDir = path.resolve(cwd, '../');

  return cosmiconfigSync('', {
    stopDir,
    loaders: {
      '.json': jsoncParser,
    },
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
  let projectPath = '';

  if (projectName) {
    const test = glob.sync(`**/${projectName}`);
    projectPath = test[0];
  }

  const angularConfig = searchConfig(angularConfigFile, projectPath);
  const workspaceConfig = searchConfig(workspaceConfigFile, projectPath);
  const projectConfig = searchConfig(projectConfigFile, projectPath);

  if (!angularConfig && !workspaceConfig && !projectConfig) {
    logNotFound([...angularConfigFile, workspaceConfigFile, projectConfigFile]);

    return { projectBasePath: defaultSourceRoot };
  }

  let resolved: ReturnType<typeof resolveProject>;

  for (const config of [angularConfig, workspaceConfig, projectConfig]) {
    resolved = resolveProject(config, projectName);
    if (resolved) {
      break;
    }
  }

  return {
    projectBasePath: resolved.sourceRoot,
    projectType: resolved.projectType,
  };
}

function resolveProject(
  config,
  projectName
): { sourceRoot: string; projectType: ProjectType } | null {
  let projectConfig = config;

  if (config?.projects) {
    projectName =
      projectName || config.defaultProject || Object.keys(config.projects)[0];
    const project = config.projects[projectName];
    projectConfig = isString(project)
      ? searchConfig(projectConfigFile, project)
      : project;
  }

  if (projectConfig?.sourceRoot) {
    return {
      sourceRoot: projectConfig.sourceRoot,
      projectType: projectConfig.projectType,
    };
  }

  return null;
}
