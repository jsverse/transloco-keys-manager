import { unflatten } from 'flat';
import { po } from 'gettext-parser';

import { getConfig } from '../../config';
import { mergeDeep, stringify } from '../../utils/object.utils';

function handleReplace(currentTranslation, translation, replace) {
  return replace
    ? mergeDeep({}, translation)
    : mergeDeep({}, translation, currentTranslation);
}

function createJson(currentTranslation, translation, replace) {
  if (getConfig().unflat) {
    translation = unflatten(translation, { object: true });
  }

  const value = handleReplace(currentTranslation, translation, replace);

  return stringify(value);
}

function createPot(currentTranslation, translation, replace) {
  const value = handleReplace(currentTranslation, translation, replace);

  return po
    .compile({
      charset: 'utf-8',
      headers: {
        'mime-version': '1.0',
        'content-type': 'text/plain; charset=utf-8',
        'content-transfer-encoding': '8bit',
      },
      translations: {
        '': Object.entries(value).reduce(
          (acc, [msgid, msgstr]) => ({
            ...acc,
            [msgid]: { msgid, msgstr },
          }),
          {} as any
        ),
      },
    })
    .toString('utf8');
}

export function createTranslation(
  currentTranslation,
  translation,
  replace,
  outputFormat
) {
  const compilers = {
    json: createJson,
    pot: createPot,
  };

  return compilers[outputFormat](currentTranslation, translation, replace);
}
