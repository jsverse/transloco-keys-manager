import {
  getGlobalConfig,
  TranslocoGlobalConfig,
} from '@ngneat/transloco-utils';
import chalk from 'chalk';
import { existsSync } from 'fs';

import { defaultConfig } from '../config';
import { getScopes } from '../keys-builder/utils/scope.utils';
import { messages } from '../messages';
import { Config } from '../types';

import { devlog } from './logger';
import { resolveConfigPaths } from './path.utils';
import { resolveProjectBasePath } from './resolve-project-base-path';
import { updateScopesMap } from './update-scopes-map';
import { isDirectory } from './validators.utils';

export function resolveConfig(inlineConfig: Config): Config {
  const { projectBasePath, projectType } = resolveProjectBasePath(
    inlineConfig.project
  );
  const defaults = defaultConfig(projectType);
  const fileConfig = getGlobalConfig(inlineConfig.config || projectBasePath);
  const userConfig = { ...flatFileConfig(fileConfig), ...inlineConfig };
  const config = { ...defaults, ...userConfig };

  devlog('config', 'Config', {
    Default: defaults,
    'Transloco file': flatFileConfig(fileConfig),
    Inline: inlineConfig,
    Merged: config,
  });

  resolveConfigPaths(config, projectBasePath);
  validateDirectories(config);

  devlog('paths', 'Configuration Paths', {
    Input: config.input,
    Output: config.output,
    Translations: config.translationsPath,
  });

  updateScopesMap({ input: config.input });

  devlog('scopes', 'Scopes', {
    'Scopes map': getScopes().scopeToAlias,
  });

  return { ...config, scopes: getScopes() };
}

function flatFileConfig(fileConfig: TranslocoGlobalConfig): Partial<Config> {
  const keysManager = fileConfig.keysManager || {};
  const { rootTranslationsPath, langs, scopePathMap } = fileConfig;

  if (keysManager.input) {
    keysManager.input = Array.isArray(keysManager.input)
      ? keysManager.input
      : keysManager.input.split(',');
  }
  const config: Partial<Config> = {
    ...keysManager,
  } as TranslocoGlobalConfig['keysManager'] & { input?: string[] };

  if (rootTranslationsPath) {
    config.translationsPath = rootTranslationsPath;
  }

  if (langs) {
    config.langs = langs;
  }

  if (scopePathMap) {
    config.scopePathMap = scopePathMap;
  }

  return config;
}

function validateDirectories({ input, translationsPath, command }: Config) {
  let invalidPath = false;
  const log = (path, prop) => {
    const msg = existsSync(path)
      ? messages.pathIsNotDir
      : messages.pathDoesntExist;
    console.log(chalk.bgRed.black(`${prop} ${msg}`));
  };

  for (const path of input) {
    if (!isDirectory(path)) {
      invalidPath = true;
      log(path, 'Input');
    }
  }

  if (command === 'find' && !isDirectory(translationsPath)) {
    invalidPath = true;
    log(translationsPath, 'Translations');
  }

  invalidPath && process.exit();
}
