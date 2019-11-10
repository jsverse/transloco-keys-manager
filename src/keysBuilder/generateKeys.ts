import { readFile } from '../helpers/readFile';
import { writeFile } from '../helpers/writeFile';
import { mergeDeep } from '../helpers/mergeDeep';
import { ScopeMap } from '../types';
import * as flat from 'flat';
import { getConfig as translocoConfig } from '@ngneat/transloco-utils';
import { getConfig } from '../config';
import * as glob from 'glob';

type Params = {
  translationPath: string;
  scopeToKeys: ScopeMap;
};

/**
 * In use in the Webpack Plugin
 */
export function generateKeys({ translationPath, scopeToKeys }: Params) {
  const scopePaths = translocoConfig().scopePathMap || {};

  let result = [];

  for (const [scope, path] of Object.entries(scopePaths)) {
    const keys = scopeToKeys[scope];
    if (keys) {
      result.push({
        keys,
        files: glob.sync(`${path}/*.json`)
      });
    }
  }

  for (const [scope, keys] of Object.entries(scopeToKeys)) {
    const isGlobal = scope === '__global';
    if (keys) {
      result.push({
        keys,
        files: glob.sync(`${translationPath}/${isGlobal ? '' : scope}*.json`)
      });
    }
  }

  for (let { files, keys } of result) {
    for (const filePath of files) {
      if (getConfig().nested) {
        keys = flat.unflatten(keys);
      }
      const translation = readFile(filePath, { parse: true });
      writeFile(filePath, mergeDeep({}, keys, translation));
    }
  }
}
