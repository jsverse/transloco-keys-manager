import { messages } from '../messages';
import { getLogger } from '../helpers/logger';
import { ScopeMap, Scopes } from '../types';
import { buildTranslationFile, FileAction } from './buildTranslationFile';

type Params = {
  scopeToKeys: ScopeMap;
  langs: string[];
  outputPath: string;
  replace: boolean;
  scopes: Scopes;
};

type Files = { path: string; name: string }[];

export function createTranslationFiles({ scopeToKeys, langs, outputPath, replace, scopes }: Params) {
  const logger = getLogger();

  const scopeFiles: Files = Object.values(scopes.aliasToScope).reduce((files: Files, scopeName: string) => {
    langs.forEach(lang =>
      files.push({
        path: `${outputPath}/${scopeName}/${lang}.json`,
        name: scopeName
      })
    );

    return files;
  }, []);

  const globalFiles = langs.map(lang => ({ path: `${outputPath}/${lang}.json` }));

  const actions: FileAction[] = [];

  for (const { path } of globalFiles) {
    actions.push(buildTranslationFile(path, scopeToKeys.__global, replace));
  }

  for (const { path, name } of scopeFiles) {
    actions.push(buildTranslationFile(path, scopeToKeys[name], replace));
  }

  const newFiles = actions.filter(action => action.type === 'new');

  if (newFiles.length) {
    logger.success(`${messages.creatingFiles} 🗂`);
    logger.log(newFiles.map(action => action.path).join('\n'));
  }

  logger.log(`\n              🌵 ${messages.done} 🌵`);
}
