import { getConfig, TranslocoConfig } from '@ngneat/transloco-utils';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { defaultConfig } from '../defaultConfig';
import { getScopes } from '../keysBuilder/scopes';
import { messages } from '../messages';
import { Config } from '../types';

import { devlog } from './logger';
import { isDirectory } from './isDirectory';
import { resolveProjectBasePath } from './resolveProjectBasePath';
import { updateScopesMap } from './updateScopesMap';

export function resolveConfig(inlineConfig: Config): Config {
  const { projectBasePath, projectType } = resolveProjectBasePath(inlineConfig.project);
  const defaults = defaultConfig(projectType);
  const fileConfig = getConfig(inlineConfig.config || projectBasePath);
  const userConfig = { ...flatFileConfig(fileConfig), ...inlineConfig };
  const config = { ...defaults, ...userConfig };

  devlog('config', 'Config', {
    Default: defaults,
    'Transloco file': flatFileConfig(fileConfig),
    Inline: inlineConfig,
    Merged: config
  });

  resolveConfigPaths(config, projectBasePath);
  validateDirectories(config);

  devlog('paths', 'Configuration Paths', {
    Input: config.input,
    Output: config.output,
    Translations: config.translationsPath
  });

  updateScopesMap({ input: config.input });

  devlog('scopes', 'Scopes', {
    'Scopes map': getScopes().scopeToAlias
  });

  return { ...config, scopes: getScopes() };
}

function flatFileConfig(fileConfig: TranslocoConfig): Partial<Config> {
  const keysManager = fileConfig.keysManager || {};
  const { rootTranslationsPath, langs, scopePathMap } = fileConfig;

  if (keysManager.input) {
    keysManager.input = Array.isArray(keysManager.input) ? keysManager.input : keysManager.input.split(',');
  }
  const config: Partial<Config> = { ...keysManager } as TranslocoConfig['keysManager'] & { input?: string[] };

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

function resolveConfigPaths(config: Config, sourceRoot: string) {
  const resolvePath = configPath => path.resolve(process.cwd(), sourceRoot, configPath);
  config.input = config.input.map(resolvePath);
  ['output', 'translationsPath'].forEach(prop => {
    config[prop] = resolvePath(config[prop]);
  });
}

function validateDirectories({ input, translationsPath, command }: Config) {
  let invalidPath = false;
  const log = (path, prop) => {
    const msg = fs.existsSync(path) ? messages.pathIsNotDir : messages.pathDoesntExists;
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
    log(translationsPath, 'Translations path');
  }
  invalidPath && process.exit();
}
