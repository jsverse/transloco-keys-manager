import path, { sep } from 'node:path';

import { getConfig } from '../config';
import { Config, Scopes } from '../types';

import { isObject } from './validators.utils';

export function pathUnixFormat(path: string) {
  return path.split(sep).join('/');
}

export function buildPath(obj: Record<string, any>) {
  return Object.keys(obj).reduce((acc, curr) => {
    const keys = isObject(obj[curr])
      ? buildPath(obj[curr]).map((inner) => `${curr}.${inner}`)
      : [curr];
    acc.push(...keys);

    return acc;
  }, [] as string[]);
}

interface Options extends Pick<Config, 'fileFormat' | 'translationsPath'> {
  filePath: string;
}

/**
 * /Users/username/www/folderName/src/assets/i18n/admin/es.json => { scope: admin, lang: es }
 * /Users/username/www/folderName/src/assets/i18n/es.json => { scope: undefined, lang: es }
 */
export function getScopeAndLangFromPath({
  filePath,
  translationsPath,
  fileFormat,
}: Options) {
  filePath = pathUnixFormat(filePath);
  translationsPath = pathUnixFormat(translationsPath);

  if (!translationsPath.endsWith('/')) {
    translationsPath = `${translationsPath}/`;
  }

  const [_, pathWithScope] = filePath.split(translationsPath);
  const scopePath = pathWithScope.split('/');
  const removeExtension = (str: string) => str.replace(`.${fileFormat}`, '');

  let scope, lang;
  if (scopePath.length > 1) {
    lang = removeExtension(scopePath.pop()!);
    scope = scopePath.join('/');
  } else {
    lang = removeExtension(scopePath[0]);
  }

  return { scope, lang };
}

export function resolveConfigPaths(config: Config, sourceRoot: string) {
  const resolvePath = (configPath?: string) =>
    path.resolve(process.cwd(), sourceRoot, configPath || '');

  config.input = config.input.map(resolvePath);
  config.output = resolvePath(config.output);
  config.translationsPath = resolvePath(config.translationsPath);
}

type ScopeFiles = { path: string; scope: string }[];

export function buildScopeFilePaths({
  aliasToScope,
  output,
  langs,
  fileFormat,
}: Pick<Config, 'output' | 'langs' | 'fileFormat'> & {
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
          path: `${bastPath}/${lang}.${fileFormat}`,
          scope,
        });
      });

      return files;
    },
    [],
  );
}
