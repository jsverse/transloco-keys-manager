import path, { sep } from 'path';

import { getConfig } from '../config';
import { Config, Scopes } from '../types';

import { isObject } from './validators.utils';

export function pathUnixFormat(path: string) {
  return path.split(sep).join('/');
}

export function buildPath(obj: object) {
  return Object.keys(obj).reduce((acc, curr) => {
    const keys = isObject(obj[curr])
      ? buildPath(obj[curr]).map((inner) => `${curr}.${inner}`)
      : [curr];
    acc.push(...keys);

    return acc;
  }, []);
}

type Params = {
  filePath: string;
  translationPath: string;
  outputFormat: 'json' | 'pot';
};

/**
 * /Users/username/www/folderName/src/assets/i18n/admin/es.json => { scope: admin, lang: es }
 * /Users/username/www/folderName/src/assets/i18n/es.json => { scope: undefined, lang: es }
 */
export function getScopeAndLangFromPath({
  filePath,
  translationPath,
  outputFormat,
}: Params) {
  filePath = pathUnixFormat(filePath);
  translationPath = pathUnixFormat(translationPath);

  if (translationPath.endsWith('/') === false) {
    translationPath = `${translationPath}/`;
  }

  const [_, pathwithScope] = filePath.split(translationPath);
  const scopePath = pathwithScope.split('/');

  let scope, lang;
  if (scopePath.length > 1) {
    lang = scopePath.pop().replace(`.${outputFormat}`, '');
    scope = scopePath.join('/');
  } else {
    lang = scopePath[0].replace(`.${outputFormat}`, '');
  }

  return { scope, lang };
}

export function resolveConfigPaths(config: Config, sourceRoot: string) {
  const resolvePath = (configPath) =>
    path.resolve(process.cwd(), sourceRoot, configPath);
  config.input = config.input.map(resolvePath);
  ['output', 'translationsPath'].forEach((prop) => {
    config[prop] = resolvePath(config[prop]);
  });
}

type ScopeFiles = { path: string; scope: string }[];

export function buildScopeFilePaths({
  aliasToScope,
  output,
  langs,
  outputFormat,
}: Pick<Config, 'output' | 'langs' | 'outputFormat'> & {
  aliasToScope: Scopes['aliasToScope'];
}) {
  const { scopePathMap = {} } = getConfig();
  return Object.values(aliasToScope).reduce(
    (files: ScopeFiles, scope: string) => {
      langs.forEach((lang) => {
        let bastPath = scopePathMap[scope]
          ? scopePathMap[scope]
          : `${output}/${scope}`;

        files.push({
          path: `${bastPath}/${lang}.${outputFormat}`,
          scope,
        });
      });

      return files;
    },
    []
  );
}
