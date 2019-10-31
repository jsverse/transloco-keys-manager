import { getConfig, TranslocoConfig } from '@ngneat/transloco-utils';
import { updateScopesMap } from './updateScopesMap';
import { Config } from '../types';
import { defaultConfig } from '../defaultConfig';
import { getScopes } from '../keysBuilder/scopes';

export function resolveConfig(inlineConfig: Config): Config {
  const defaults = defaultConfig;
  const fileConfig = getConfig();

  const config = { ...defaults, ...flatFileConfig(fileConfig), ...inlineConfig };

  updateScopesMap({ input: config.input });
  return { ...config, scopes: getScopes() };
}

function flatFileConfig(fileConfig: TranslocoConfig) {
  const keysManager = fileConfig.keysManager || {};
  const { rootTranslationsPath, langs } = fileConfig;

  if(rootTranslationsPath) {
    keysManager['translationsPath'] = fileConfig.rootTranslationsPath;
  }

  if(langs) {
    keysManager['langs'] = fileConfig.langs;
  }

  return keysManager;
}
