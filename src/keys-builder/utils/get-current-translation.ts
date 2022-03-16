import * as fsExtra from 'fs-extra';
import { po } from 'gettext-parser';
import { unflatten } from 'flat';

import { getConfig } from '../../config';

function parseJson(path) {
  return fsExtra.readJsonSync(path, { throws: false }) || {};
}

function parsePot(path) {
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

const parsers = {
  json: parseJson,
  pot: parsePot,
};

export function getCurrentTranslation({ path, outputFormat }) {
  return parsers[outputFormat](path);
}
