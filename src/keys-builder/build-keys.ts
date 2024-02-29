import { Config, ScopeMap } from '../types';
import { checkForProblematicUnflatKeys } from '../utils/keys.utils';
import { mergeDeep } from '../utils/object.utils';
import { extractTemplateKeys } from './template';
import { extractTSKeys } from './typescript';

export function buildKeys(config: Config) {
  const [template, ts] = [extractTemplateKeys(config) /* TODO */, extractTSKeys(config)];

  const scopeToKeys: ScopeMap = mergeDeep(
    {},
    template.scopeToKeys,
    ts.scopeToKeys
  );
  const fileCount = template.fileCount + ts.fileCount;
  const defaults = template.defaults.concat(ts.defaults);

  if (config.unflat) {
    for (const scopeKeys of Object.values(scopeToKeys)) {
      checkForProblematicUnflatKeys(scopeKeys);
    }
  }

  return { scopeToKeys, defaults, fileCount };
}
