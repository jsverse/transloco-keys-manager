import * as fsExtra from 'fs-extra';
import { Config, DefaultLanguageValue, Translation } from '../types';
import { createTranslation } from './utils/create-translation';
import { getCurrentTranslation } from './utils/get-current-translation';
import _ from 'lodash';

export interface FileAction {
  path: string;
  type: 'new' | 'modified';
}

interface BuildTranslationOptions
  extends Pick<Config, 'fileFormat'>,
    Partial<Pick<Config, 'replace' | 'removeExtraKeys'>> {
  path: string;
  translation?: Translation;
  defaults?: DefaultLanguageValue[];
  isDefaultLanguage?: boolean;
  defaultOverrideExisting?: boolean
}

export function buildTranslationFile({
  path,
  translation = {},
  replace = false,
  removeExtraKeys = false,
  fileFormat,
  defaults,
  isDefaultLanguage,
  defaultOverrideExisting
}: BuildTranslationOptions): FileAction {
  const currentTranslation = getCurrentTranslation({ path, fileFormat });
  const newTranslation = _.cloneDeep(translation);

  if (isDefaultLanguage) {
    defaults.forEach((d) => {
      newTranslation[d.key] = d.value;

      // TODO
      if (defaultOverrideExisting) {
        const curentTranslationIndex = Object.keys(currentTranslation).findIndex(k => k == d.key);
        if (curentTranslationIndex != -1 && Object.values(currentTranslation)[curentTranslationIndex] != d.value) {
          console.log("Updated translation: '" + d.key + "'");
          // TODO Set the current translationIndex
        }
      }
    });
  }

  fsExtra.outputFileSync(
    path,
    createTranslation({
      currentTranslation,
      translation: newTranslation,
      replace,
      removeExtraKeys,
      fileFormat,
    })
  );

  return { type: currentTranslation ? 'modified' : 'new', path };
}
