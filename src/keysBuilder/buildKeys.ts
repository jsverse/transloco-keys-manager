import { checkForProblematicUnflatKeys } from '../helpers/checkForProblematicUnflatKeys';
import { mergeDeep } from '../helpers/mergeDeep';
import { Config } from '../types';
import { extractTemplateKeys } from './extractTemplateKeys';
import { extractTSKeys } from './extractTSKeys';

export function buildKeys(config: Config) {
  const [template, ts] = [extractTemplateKeys(config), extractTSKeys(config)];

  const scopeToKeys = mergeDeep({}, template.scopeToKeys, ts.scopeToKeys);
  const fileCount = template.fileCount + ts.fileCount;

  if (config.unflat) {
    for (const [_, scopeKeys] of Object.entries(scopeToKeys)) {
      checkForProblematicUnflatKeys(scopeKeys as object);
    }
  }

  return { scopeToKeys, fileCount };
}
