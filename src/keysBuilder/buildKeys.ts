import { checkForProblematicUnflatKeys } from '../helpers/checkForProblematicUnflatKeys';
import { mergeDeep } from '../helpers/mergeDeep';
import { Config, ScopeMap } from '../types';
import { extractTemplateKeys } from './extractTemplateKeys';
import { extractTSKeys } from './extractTSKeys';

export function buildKeys(config: Config) {
  const [template, ts] = [extractTemplateKeys(config), extractTSKeys(config)];

  const scopeToKeys: ScopeMap = mergeDeep({}, template.scopeToKeys, ts.scopeToKeys);
  const fileCount = template.fileCount + ts.fileCount;

  if (config.unflat) {
    for (const scopeKeys of Object.values(scopeToKeys)) {
      checkForProblematicUnflatKeys(scopeKeys);
    }
  }

  return { scopeToKeys, fileCount };
}
