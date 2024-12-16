import { Config, ScopeMap } from '../types';
import { checkForProblematicUnflatKeys } from '../utils/keys.utils';
import { mergeDeep } from '../utils/object.utils';
import { extractTemplateKeys } from './template';
import { extractTSKeys } from './typescript';
import { Defaults } from '../utils/defaults';

export function buildKeys(config: Config) {
  const [template, ts] = [extractTemplateKeys(config), extractTSKeys(config)];

  Defaults.setDefaultOverwrite(config.defaultOverwrite);
  Defaults.setDefaultLanguage(config.defaultLanguage);

  const scopeToKeys = mergeDeep(
    {},
    template.scopeToKeys,
    ts.scopeToKeys,
  ) as ScopeMap;
  const fileCount = template.fileCount + ts.fileCount;

  if (config.unflat) {
    for (const scopeKeys of Object.values(scopeToKeys)) {
      checkForProblematicUnflatKeys(scopeKeys);
    }
  }

  return { scopeToKeys, fileCount };
}
