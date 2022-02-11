import * as fsExtra from 'fs-extra';

import { Format } from '../types';
import { createTranslation } from './utils/create-translation';
import { getCurrentTranslation } from './utils/get-current-translation';

export interface FileAction {
  path: string;
  type: 'new' | 'modified';
}

export function buildTranslationFile(
  path: string,
  translation = {},
  replace = false,
  format: Format
): FileAction {
  const currentTranslation = getCurrentTranslation(path, format);

  fsExtra.outputFileSync(
    path,
    createTranslation(currentTranslation, translation, replace, format)
  );

  return { type: currentTranslation ? 'modified' : 'new', path };
}
