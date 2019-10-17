import { mergeDeep } from '../helpers/mergeDeep';
import { extractTemplateKeys } from './extractTemplateKeys';
import { extractTSKeys } from './extractTSKeys';
import { Config, ExtractionResult } from '../types';

export async function buildKeys(config: Config) {
  const result: [ExtractionResult, ExtractionResult] = await Promise.all(
    [extractTemplateKeys(config), extractTSKeys(config)]
  );

  const [template, ts] = result;

  const keys = mergeDeep({}, template.keys, ts.keys);
  const fileCount = template.fileCount + ts.fileCount;

  return Promise.resolve({ keys, fileCount });
}
