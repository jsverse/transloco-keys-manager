import * as fsExtra from 'fs-extra';
import { po } from 'gettext-parser';
import { unflatten } from 'flat';

import { getConfig } from '../../config';
import { NestedRecord } from '../../types';

function parseJson(path: string): NestedRecord {
  return fsExtra.readJsonSync(path, { throws: false }) || {};
}

function parsePot(path: string) {
  try {
    const file = fsExtra.readFileSync(path, 'utf8');
    const parsed = po.parse(file, 'utf8');

    if (!Object.keys(parsed.translations).length) {
      return {};
    }

    const value = Object.keys(parsed.translations[''])
      .filter((key) => key.length > 0)
      .reduce<Record<string, string>>(
        (acc, key) => ({
          ...acc,
          [key]: parsed.translations[''][key].msgstr.pop(),
        }),
        {}
      );

    return getConfig().unflat
      ? unflatten<Record<string, string>, NestedRecord>(value, {
          object: true,
        })
      : value;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return {};
    }

    console.warn(
      'Something is wrong with the provided file at "%s":',
      path,
      e.message
    );
  }
}

const parsers = {
  json: parseJson,
  pot: parsePot,
};

export function getCurrentTranslation({
  path,
  outputFormat,
}: {
  path: string;
  outputFormat: 'json' | 'pot';
}): NestedRecord {
  return parsers[outputFormat](path);
}
