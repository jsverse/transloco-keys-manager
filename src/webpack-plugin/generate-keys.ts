import { TranslocoGlobalConfig } from '@ngneat/transloco-utils';
import { unflatten } from 'flat';
import * as glob from 'glob';
import * as nodePath from 'path';

import { ScopeMap, Config } from '../types';
import { readFile, writeFile } from '../utils/file.utils';
import { mergeDeep } from '../utils/object.utils';

type Params = {
  translationPath: string;
  scopeToKeys: ScopeMap;
  config: Config & TranslocoGlobalConfig;
};

function filterLangs(config: Params['config']) {
  return function (path: string) {
    return config.langs.find(
      (lang) =>
        lang === nodePath.basename(path).replace(`.${config.fileFormat}`, '')
    );
  };
}

/**
 * In use in the Webpack Plugin
 */
export function generateKeys({ translationPath, scopeToKeys, config }: Params) {
  const scopePaths = config.scopePathMap || {};

  let result = [];

  for (const [scope, path] of Object.entries(scopePaths)) {
    const keys = scopeToKeys[scope];
    if (keys) {
      result.push({
        keys,
        files: glob
          .sync(`${path}/*.${config.fileFormat}`)
          .filter(filterLangs(config)),
      });
    }
  }

  for (const [scope, keys] of Object.entries(scopeToKeys)) {
    if (keys) {
      const isGlobal = scope === '__global';

      result.push({
        keys,
        files: glob
          .sync(
            `${translationPath}/${isGlobal ? '' : scope}*.${config.fileFormat}`
          )
          .filter(filterLangs(config)),
      });
    }
  }

  for (let { files, keys } of result) {
    if (config.unflat) {
      keys = unflatten(keys);
    }
    for (const filePath of files) {
      const translation = readFile(filePath, { parse: true });
      writeFile(filePath, mergeDeep({}, keys, translation));
    }
  }
}
