import {
  Config,
  DefaultLanguageValue,
  ExtractionResult,
  ExtractorConfig,
  FileType,
  ScopeMap,
} from '../../types';
import { initExtraction } from '../../utils/init-extraction';
import { devlog } from '../../utils/logger';
import { normalizedGlob } from '../../utils/normalize-glob-path';

export function extractKeys(
<<<<<<< HEAD
  { input, scopes, defaultValue, files, defaultPipeArgument }: Config,
  fileType: 'ts' | 'html',
  extractor: (config: ExtractorConfig) => {
    scopeMap: ScopeMap;
    defaults: DefaultLanguageValue[];
  }
): ExtractionResult {
  let { scopeToKeys, defaults } = initExtraction();
=======
  { input, scopes, defaultValue, files }: Config,
  fileType: FileType,
  extractor: (config: ExtractorConfig) => ScopeMap,
): ExtractionResult {
  let { scopeToKeys } = initExtraction();
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7

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
      defaultPipeArgument,
      defaults
    });
    scopeToKeys = res.scopeMap
    defaults.push(...res.defaults);
  }

  return { scopeToKeys, defaults, fileCount: fileList.length };
}
