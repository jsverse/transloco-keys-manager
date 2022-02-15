import * as fsExtra from 'fs-extra';

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
  outputFormat
): FileAction {
  const currentTranslation = getCurrentTranslation(path, outputFormat);

  fsExtra.outputFileSync(
    path,
    createTranslation(currentTranslation, translation, replace, outputFormat)
  );

  return { type: currentTranslation ? 'modified' : 'new', path };
}
