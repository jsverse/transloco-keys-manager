import { unflatten } from 'flat';
import { po } from 'gettext-parser';

import { Format } from '../../types';
import { mergeDeep, stringify } from '../../utils/object.utils';
import { getConfig } from '../../config';

function createJson(currentTranslation, translation, replace) {
  let value;

  if (getConfig().unflat) {
    translation = unflatten(translation, { object: true });
  }

  if (replace) {
    value = mergeDeep({}, translation);
  } else {
    value = mergeDeep({}, translation, currentTranslation);
  }

  return stringify(value);
}

function createPot(currentTranslation, translation, replace) {
  let value;

  if (replace) {
    value = mergeDeep({}, translation);
  } else {
    value = mergeDeep({}, translation, currentTranslation);
  }

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
          (acc, [k, v]) => ({
            ...acc,
            [k]: { msgid: k, msgstr: v },
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
  replace: boolean,
  format: Format
) {
  const compilers = {
    [Format.Json]: createJson,
    [Format.Pot]: createPot,
  };

  return compilers[format](currentTranslation, translation, replace);
}
