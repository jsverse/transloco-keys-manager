import { getTranslationFilesPath } from './getTranslationFilesPath';
import { regexs } from '../regexs';
import { readFile } from '../helpers/readFile';
import { writeFile } from '../helpers/writeFile';
import { mergeDeep } from '../helpers/mergeDeep';
import { ScopeMap } from '../types';

type Params = {
  translationPath: string;
  scopeToKeys: ScopeMap;
}

/**
 * In use in the Webpack Plugin
 */
export function generateKeys({ translationPath, scopeToKeys }: Params) {
  const currentFiles = getTranslationFilesPath(translationPath);
  if(!currentFiles) return;

  for(const fileName of currentFiles) {
    const { scope } = regexs.fileLang(translationPath).exec(fileName).groups;
    const keys = scope ? scopeToKeys[scope] : scopeToKeys.__global;

    if(!keys) continue;

    const translation = readFile(fileName, { parse: true });
    writeFile(fileName, mergeDeep({}, translation, keys));
  }
}
