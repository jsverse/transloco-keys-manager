import { mergeDeep } from '../helpers/mergeDeep';
import { stringify } from '../helpers/stringify';
import * as fsExtra from 'fs-extra';

export type FileAction = {
  path: string;
  type: 'new' | 'modified'
}

export function buildTranslationFile(path: string, translation: object, replace = false): FileAction {
  const currentTranslation = fsExtra.readJsonSync(path, { throws: false });
  const action: FileAction = { type: currentTranslation ? 'modified' : 'new', path };

  let newTranslation;

  if(replace) {
    newTranslation = mergeDeep({}, translation);
  } else {
    newTranslation = mergeDeep({}, currentTranslation || {}, translation);
  }

  fsExtra.outputFileSync(path, stringify(newTranslation));

  return action;
}
