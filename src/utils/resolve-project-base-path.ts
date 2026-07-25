import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import path from 'path';

import { ProjectType } from '../config';

import { coerceArray } from './collection.utils';
import { readFile } from './file.utils';
import { jsoncParser } from './json.utils';
import { isString } from './validators.utils';
import { normalizedGlob } from './normalize-glob-path';

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
        ', ',
      )}. Defaulting source root to '${defaultSourceRoot}'`,
    ),
  );
}

export function resolveProjectBasePath(projectName?: string): {
  projectBasePath: string;
  projectType?: ProjectType;
} {
  const angularConfig = searchConfig(angularConfigFile);
  const workspaceConfig = searchConfig(workspaceConfigFile);
  const projectConfig = resolveProjectConfig(projectName);

  if (!angularConfig && !workspaceConfig && !projectConfig) {
    logNotFound([...angularConfigFile, workspaceConfigFile, projectConfigFile]);

    return { projectBasePath: defaultSourceRoot };
  }

  let resolved: ReturnType<typeof resolveProject> | null = null;

  for (const config of [angularConfig, workspaceConfig, projectConfig]) {
    resolved = resolveProject(config, projectName);
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

/**
 * Locates the `project.json` of the given project.
 *
 * The project name can't be used as a path since workspaces are free to name a
 * project differently than the directory holding it, e.g. `libs/booking/ui/button`
 * is commonly named `booking-ui-button`. Therefore every `project.json` is matched
 * against its `name`, preferring it over the directory name, which is what a config
 * omitting the `name` is named after.
 */
function resolveProjectConfig(projectName?: string) {
  if (projectName) {
    let directoryMatch: Record<string, any> | undefined;

    for (const configPath of normalizedGlob(`**/${projectConfigFile}`)) {
      const config = jsoncParser(configPath, readFile(configPath));

      if (config?.name === projectName) {
        return config;
      }

      if (
        !directoryMatch &&
        path.basename(path.dirname(configPath)) === projectName
      ) {
        directoryMatch = config;
      }
    }

    if (directoryMatch) {
      return directoryMatch;
    }
  }

  // a root level config holding a `projects` map, resolved by `resolveProject`
  return searchConfig(projectConfigFile);
}

function resolveProject(
  config: Record<string, any>,
  projectName: string | undefined,
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
      sourceRoot: projectConfig.sourceRoot,
      projectType: projectConfig.projectType,
    };
  }

  return null;
}
