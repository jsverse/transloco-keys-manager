import { getLogger } from '../helpers/logger';
import { messages } from '../messages';
import { mapDiffToKeys } from './mapDiffToKeys';
import * as columnify from 'columnify';

type columnifyRow = {
  fileName?: string,
  missing?: string,
  extra?: string
};

type Params = {
  addMissingKeys: boolean;
  langs: string[];
  diffsPerLang: {
    [lang: string]: {
      missing: any[];
      extra: any[];
    };
  };
};

export function buildTable({ langs, diffsPerLang, addMissingKeys }: Params) {
  const logger = getLogger();
  if(langs.length > 0) {
    logger.success(`\x1b[4m${messages.summary}\x1b[0m\n`);
    let data: columnifyRow[] = [];

    for(let i = 0; i < langs.length; i++) {
      data.push({ fileName: '_______', missing: '_______', extra: '_______' });
      data.push({ fileName: '', missing: '', extra: '' });
      const row: columnifyRow = {};
      const { missing, extra } = diffsPerLang[langs[i]];
      const hasMissing = missing.length > 0;
      const hasExtra = extra.length > 0;

      if(!(hasExtra || hasMissing)) continue;

      row.fileName = langs[i];
      row.missing = hasMissing ? mapDiffToKeys(missing, 'rhs') : 'None';
      row.extra = hasExtra ? mapDiffToKeys(extra, 'lhs') : 'None';

      data.push(row);
    }

    logger.log(columnify(data, { preserveNewLines: true, align: 'center' }));
    addMissingKeys && logger.success(`Added all missing keys to files 📜\n`);
  } else {
    logger.log(`\n🎉 ${messages.noMissing} 🎉\n`);
  }

  logger.log('\n');
}
