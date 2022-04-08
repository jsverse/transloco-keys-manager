import { unflatten } from 'flat';
import * as fsExtra from 'fs-extra';
import { po } from 'gettext-parser';

import { getConfig } from '../../config';
import { FileFormats, Translation } from '../../types';

function parseJson(path: string): Translation {
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
      ? unflatten<Record<string, string>, Translation>(value, {
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

const parsers: Record<FileFormats, (path: string) => Translation> = {
  json: parseJson,
  pot: parsePot,
};

interface GetTranslationsOptions {
  path: string;
  fileFormat: FileFormats;
}

export function getCurrentTranslation({
  path,
  fileFormat,
}: GetTranslationsOptions): Translation {
  return parsers[fileFormat](path);
}
