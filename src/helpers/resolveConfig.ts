import { getConfig, TranslocoConfig } from '@ngneat/transloco-utils';
import { buildScopesMap } from './buildScopesMap';
import { Config } from '../types';
import { defaultConfig } from '../defaultConfig';

export function resolveConfig(inlineConfig: Config): Config {
  const defaults = defaultConfig;
  const fileConfig = getConfig();

  const config = { ...defaults, ...flatFileConfig(fileConfig), ...inlineConfig };

  return { ...config, scopes: buildScopesMap(config.input) };
}

function flatFileConfig(fileConfig: TranslocoConfig) {
  const keysManager = fileConfig.keysManager || {};
  return {
    translationsPath: fileConfig.rootTranslationsPath,
    langs: fileConfig.langs,
    ...keysManager
  }
}
