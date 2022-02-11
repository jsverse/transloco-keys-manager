import * as fsExtra from 'fs-extra';
import { po } from 'gettext-parser';
import { unflatten } from 'flat';

import { getConfig } from '../../config';
import { Format } from '../../types';

function getJson(path: string) {
  return fsExtra.readJsonSync(path, { throws: false }) || {};
}

function getPot(path: string) {
  try {
    const file = fsExtra.readFileSync(path, 'utf8');
    const parsed = po.parse(file, 'utf8');

    if (!Object.keys(parsed.translations).length) {
      return {};
    }

    const value = Object.keys(parsed.translations[''])
      .filter((key) => key.length > 0)
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: parsed.translations[''][key].msgstr.pop(),
        }),
        {}
      );

    return getConfig().unflat ? unflatten(value, { object: true }) : value;
  } catch {
    return {};
  }
}

export function getCurrentTranslation(path: string, format: Format) {
  const parsers = {
    [Format.Json]: getJson,
    [Format.Pot]: getPot,
  };

  return parsers[format](path);
}
