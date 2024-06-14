<<<<<<< HEAD
import * as fsExtra from 'fs-extra';
import { Config, DefaultLanguageValue, Translation } from '../types';
=======
import fs from 'fs-extra';

import { Config, Translation } from '../types';

>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
import { createTranslation } from './utils/create-translation';
import { getCurrentTranslation } from './utils/get-current-translation';
import _ from 'lodash';

export interface FileAction {
  path: string;
  type: 'new' | 'modified';
}

interface BuildTranslationOptions
  extends Required<Pick<Config, 'fileFormat'>>,
    Partial<Pick<Config, 'replace' | 'removeExtraKeys'>> {
  path: string;
  translation?: Translation;
  defaults?: DefaultLanguageValue[];
  isDefaultLanguage?: boolean;
  defaultOverrideExisting?: boolean;
}

export function buildTranslationFile({
  path,
  translation = {},
  replace = false,
  removeExtraKeys = false,
  fileFormat,
  defaults,
  isDefaultLanguage,
  defaultOverrideExisting,
}: BuildTranslationOptions): FileAction {
  const currentTranslation = getCurrentTranslation({ path, fileFormat });
  const newTranslation = _.cloneDeep(translation);

  if (isDefaultLanguage) {
    defaults.forEach((d) => {
      newTranslation[d.key] = d.value;

      if (defaultOverrideExisting) {
        const curentTranslationIndex = Object.keys(
          currentTranslation
        ).findIndex((k) => k == d.key);
        if (
          curentTranslationIndex != -1 &&
          Object.values(currentTranslation)[curentTranslationIndex] != d.value
        ) {
          const oldText = currentTranslation[d.key];
          currentTranslation[d.key] = d.value;
          console.log(
            `💪 Updated translation: '${d.key}' from '${oldText}' to '${d.value}'`
          );
        }
      }
    });
  }

  fs.outputFileSync(
    path,
    createTranslation({
      currentTranslation,
      translation: newTranslation,
      replace,
      removeExtraKeys,
      fileFormat,
    }),
  );

  return { type: currentTranslation ? 'modified' : 'new', path };
}
