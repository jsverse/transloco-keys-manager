import { Scopes } from '../types';

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
  return Object.values(aliasToScope).reduce((files: ScopeFiles, scope: string) => {
    langs.forEach(lang =>
      files.push({
        path: `${outputPath}/${scope}/${lang}.json`,
        scope
      })
    );

    return files;
  }, []);
}
