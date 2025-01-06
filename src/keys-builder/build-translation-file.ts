import fs from 'fs-extra';

import { Config, Translation } from '../types';

import { createTranslation } from './utils/create-translation';
import { getCurrentTranslation } from './utils/get-current-translation';
import { Defaults } from '../utils/defaults';

export interface FileAction {
  path: string;
  type: 'new' | 'modified';
}

interface BuildTranslationOptions
  extends Required<Pick<Config, 'fileFormat'>>,
    Partial<Pick<Config, 'replace' | 'removeExtraKeys'>> {
  path: string;
  translation?: Translation;
}

export function buildTranslationFile({
  path,
  translation = {},
  replace = false,
  removeExtraKeys = false,
  fileFormat
}: BuildTranslationOptions): FileAction {
  const currentTranslation = getCurrentTranslation({ path, fileFormat });

  fs.outputFileSync(
    path,
    createTranslation({
      currentTranslation,
      translation,
      replace,
      removeExtraKeys,
      fileFormat,
    }),
  );

  return { type: currentTranslation ? 'modified' : 'new', path };
}

interface BuildTranslationOptionsWithDefaults extends  BuildTranslationOptions {
  lang: string;
}

export function buildTranslationFileWithDefaults({
  path,
  translation = {},
  replace = false,
  removeExtraKeys = false,
  fileFormat,
  lang
}: BuildTranslationOptionsWithDefaults): FileAction {
  let currentTranslation = getCurrentTranslation({ path, fileFormat });

  const defRes = Defaults.handleTranslation(translation, currentTranslation, lang);
  translation = defRes.translation;
  currentTranslation = defRes.currentTranslation;

  fs.outputFileSync(
    path,
    createTranslation({
      currentTranslation,
      translation,
      replace,
      removeExtraKeys,
      fileFormat,
    }),
  );

  return { type: currentTranslation ? 'modified' : 'new', path };
}

