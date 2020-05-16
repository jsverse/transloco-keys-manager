import { Scopes } from '../types';
import { getConfig } from '../config';

export type ScopeFiles = { path: string; scope: string }[];

export function buildScopeFilePaths({
  aliasToScope,
  outputPath,
  langs
}: {
  aliasToScope: Scopes['aliasToScope'];
  outputPath: string;
  langs: string[];
}) {
  const { scopePathMap = {} } = getConfig();
  return Object.values(aliasToScope).reduce((files: ScopeFiles, scope: string) => {
    langs.forEach(lang => {
      let bastPath = scopePathMap[scope] ? scopePathMap[scope] : `${outputPath}/${scope}`;

      files.push({
        path: `${bastPath}/${lang}.json`,
        scope
      });
    });

    return files;
  }, []);
}
