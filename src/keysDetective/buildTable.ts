import { getLogger } from '../helpers/logger';
import { messages } from '../messages';
import chalk from 'chalk';
import { mapDiffToKeys } from './mapDiffToKeys';
import * as Table from 'cli-table';

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
  if (langs.length > 0) {
    logger.success(`🏁 \x1b[4m${messages.summary}\x1b[0m 🏁`);

    const table = new Table({
      head: ['File Name', 'Missing Keys', 'Extra Keys'].map(h => chalk.cyan(h)),
      colWidths: [40, 40, 30]
    });

    for (let i = 0; i < langs.length; i++) {
      const row = [];
      const { missing, extra } = diffsPerLang[langs[i]];
      const hasMissing = missing.length > 0;
      const hasExtra = extra.length > 0;

      if (!(hasExtra || hasMissing)) continue;

      row.push(`${langs[i]}`);

      if (hasMissing) {
        row.push(mapDiffToKeys(missing, 'rhs'));
      } else {
        row.push('--');
      }

      if (hasExtra) {
        row.push(mapDiffToKeys(extra, 'lhs'));
      } else {
        row.push('--');
      }

      table.push(row);
    }

    logger.log(table.toString());
    addMissingKeys && logger.success(`Added all missing keys to files 📜\n`);
  } else {
    logger.log(`\n🎉 ${messages.noMissing} 🎉\n`);
  }
}
