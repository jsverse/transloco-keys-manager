import * as fsExtra from 'fs-extra';
import { po } from 'gettext-parser';
import { unflatten } from 'flat';

import { getConfig } from '../../config';

function getJson(path) {
  return fsExtra.readJsonSync(path, { throws: false }) || {};
}

function getPot(path) {
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

export function getCurrentTranslation(path, outputFormat) {
  const parsers = {
    json: getJson,
    pot: getPot,
  };

  return parsers[outputFormat](path);
}
