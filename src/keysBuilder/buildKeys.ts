import { mergeDeep } from '../helpers/mergeDeep';
import { Config } from '../types';
import { extractTemplateKeys } from './extractTemplateKeys';
import { extractTSKeys } from './extractTSKeys';

export function buildKeys(config: Config) {
  const [template, ts] = [extractTemplateKeys(config), extractTSKeys(config)];

  const scopeToKeys = mergeDeep({}, template.scopeToKeys, ts.scopeToKeys);
  const fileCount = template.fileCount + ts.fileCount;

  return { scopeToKeys, fileCount };
}
