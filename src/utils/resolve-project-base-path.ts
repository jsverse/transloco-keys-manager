import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import path from 'path';

import { ProjectType } from '../config';

import { coerceArray } from './collection.utils';
import { jsoncParser } from './json.utils';
import { isString } from './validators.utils';
import { normalizedGlob } from './normalize-glob-path';

const angularConfigFile = ['angular.json', '.angular.json'];
const workspaceConfigFile = 'workspace.json';
const projectConfigFile = 'project.json';
const defaultSourceRoot = 'src';

function searchConfig(searchPlaces: string[] | string, workdir = '', searchFrom = '') {
  const cwd = process.cwd();
  const resolvePath = path.resolve(cwd, workdir, searchFrom);
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
        ', ',
      )}. Defaulting source root to '${defaultSourceRoot}'`,
    ),
  );
}

export function resolveProjectBasePath(projectName?: string, workdir?: string): {
  projectBasePath: string;
  projectType?: ProjectType;
} {
  let projectPath = '';

  if (projectName) {
    projectPath = normalizedGlob(`**/${projectName}`)[0];
  }

  const angularConfig = searchConfig(angularConfigFile, workdir, projectPath);
  const workspaceConfig = searchConfig(workspaceConfigFile, workdir, projectPath);
  const projectConfig = searchConfig(projectConfigFile, workdir, projectPath);

  if (!angularConfig && !workspaceConfig && !projectConfig) {
    logNotFound([...angularConfigFile, workspaceConfigFile, projectConfigFile]);

    return { projectBasePath: defaultSourceRoot };
  }

  let resolved: ReturnType<typeof resolveProject> | null = null;

  for (const config of [angularConfig, workspaceConfig, projectConfig]) {
    resolved = resolveProject(config, projectName, workdir);
    if (resolved) {
      break;
    }
  }

  if (!resolved) {
    console.log(
      chalk.black.bgRed(
        `Unable to resolve \`projectBasePath\` from configuration. Defaulting source root to '${defaultSourceRoot}'`,
      ),
    );

    return { projectBasePath: defaultSourceRoot };
  }

  return {
    projectBasePath: resolved.sourceRoot,
    projectType: resolved.projectType,
  };
}

function resolveProject(
<<<<<<< HEAD
  config,
  projectName,
  workdir
=======
  config: Record<string, any>,
  projectName: string | undefined,
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
): { sourceRoot: string; projectType: ProjectType } | null {
  let projectConfig = config;

  if (config?.projects) {
    projectName =
      projectName || config.defaultProject || Object.keys(config.projects)[0];
    const project = config.projects[projectName!];
    projectConfig = isString(project)
      ? searchConfig(projectConfigFile, project)
      : project;
  }

  if (projectConfig?.sourceRoot) {
    return {
      sourceRoot: workdir ? path.resolve(workdir, projectConfig.sourceRoot) : projectConfig.sourceRoot,
      projectType: projectConfig.projectType,
    };
  }

  return null;
}
