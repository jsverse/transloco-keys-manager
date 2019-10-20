import { getConfig } from '@ngneat/transloco-utils';
import { buildScopesMap } from './buildScopesMap';
import { Config } from '../types';
import { defaultConfig } from '../defaultConfig';

export function resolveConfig(inlineConfig: Config): Config {
  const defaults = defaultConfig;
  const fileConfig = getConfig();

  const config = { ...defaults, ...flatFileConfig(fileConfig as FileConfig), ...inlineConfig };

  return { ...config, scopes: buildScopesMap(config.input) };
}

// Move it to TranslocoConfig
type FileConfig = {
  rootTranslationsPath?: string;
  langs: Config['langs'];
  keysManager: Pick<Config, 'addMissingKeys' | 'replace' | 'defaultValue'>;
}

function flatFileConfig(fileConfig: FileConfig) {
  const keysManager = fileConfig.keysManager || {};
  return {
    translationsPath: fileConfig.rootTranslationsPath,
    langs: fileConfig.langs,
    ...keysManager
  }
}
