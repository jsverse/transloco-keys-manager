import { getConfig } from '@ngneat/transloco-utils';
import { buildScopesMap } from './buildScopesMap';
import { Config } from '../types';
import { defaultConfig } from '../defaultConfig';

export function resolveConfig(inlineConfig: Config): Config {
  const defaults = defaultConfig;
  const fileConfig = getConfig();

  const config = { ...defaults, ...fileConfig, ...inlineConfig };

  return { ...config, scopes: buildScopesMap(config.input) };
}
