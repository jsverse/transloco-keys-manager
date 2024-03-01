import {
  Config,
  DefaultLanguageValue,
  ExtractionResult,
  ExtractorConfig,
  ScopeMap,
} from '../../types';
import { initExtraction } from '../../utils/init-extraction';
import { devlog } from '../../utils/logger';
import { normalizedGlob } from '../../utils/normalize-glob-path';

export function extractKeys(
  { input, scopes, defaultValue, files, defaultPipeArgument }: Config,
  fileType: 'ts' | 'html',
  extractor: (config: ExtractorConfig) => {
    scopeMap: ScopeMap;
    defaults: DefaultLanguageValue[];
  }
): ExtractionResult {
  let { scopeToKeys, defaults } = initExtraction();

  const fileList =
    files ||
    input.map((path) => normalizedGlob(`${path}/**/*.${fileType}`)).flat();

  for (const file of fileList) {
    devlog('extraction', 'Extracting keys', { file, fileType });
    const res = extractor({
      file,
      defaultValue,
      scopes,
      scopeToKeys,
      defaultPipeArgument
    });
    scopeToKeys = res.scopeMap
    defaults.push(...res.defaults);
  }

  return { scopeToKeys, defaults, fileCount: fileList.length };
}
