import { unflatten } from 'flat';
import { po } from 'gettext-parser';

import { getConfig } from '../../config';
import { NestedRecord } from '../../types';
import { mergeDeep, stringify } from '../../utils/object.utils';

type Params = {
  currentTranslation: NestedRecord;
  translation: NestedRecord;
  replace: boolean;
};

function resolveTranslation({
  currentTranslation,
  translation,
  replace,
}: Params): NestedRecord {
  return replace
    ? mergeDeep({}, translation)
    : mergeDeep({}, translation, currentTranslation);
}

function createJson({ currentTranslation, translation, replace }: Params) {
  if (getConfig().unflat) {
    translation = unflatten(translation, { object: true });
  }

  const resolved = resolveTranslation({
    currentTranslation,
    translation,
    replace,
  }) as object;

  return stringify(resolved);
}

function createPot({ currentTranslation, translation, replace }: Params) {
  const resolved = resolveTranslation({
    currentTranslation,
    translation,
    replace,
  });

  return po
    .compile({
      charset: 'utf-8',
      headers: {
        'mime-version': '1.0',
        'content-type': 'text/plain; charset=utf-8',
        'content-transfer-encoding': '8bit',
      },
      translations: {
        '': Object.entries(resolved).reduce(
          (acc, [msgid, msgstr]) => ({
            ...acc,
            [msgid]: { msgid, msgstr },
          }),
          {}
        ),
      },
    })
    .toString('utf8');
}

const compilers = {
  json: createJson,
  pot: createPot,
};

export function createTranslation({
  currentTranslation,
  translation,
  replace,
  outputFormat,
}: Params & {
  outputFormat: 'json' | 'pot';
}): string {
  return compilers[outputFormat]({ currentTranslation, translation, replace });
}
