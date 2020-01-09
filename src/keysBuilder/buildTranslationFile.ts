import { mergeDeep } from '../helpers/mergeDeep';
import { stringify } from '../helpers/stringify';
import { getConfig } from '../config';
import * as fsExtra from 'fs-extra';
import * as flat from 'flat';

export type FileAction = {
  path: string;
  type: 'new' | 'modified';
};

export function buildTranslationFile(path: string, translation = {}, replace = false): FileAction {
  const currentTranslation = fsExtra.readJsonSync(path, { throws: false }) || {};
  const action: FileAction = { type: currentTranslation ? 'modified' : 'new', path };

  let newTranslation;
  if (getConfig().unflat) {
    translation = flat.unflatten(translation, { object: true });
  }

  if (replace) {
    newTranslation = mergeDeep({}, translation);
  } else {
    newTranslation = mergeDeep(translation, currentTranslation);
  }

  fsExtra.outputFileSync(path, stringify(newTranslation));

  return action;
}
