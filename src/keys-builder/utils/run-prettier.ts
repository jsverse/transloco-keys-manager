import { writeFileSync } from 'fs';

import { readFile } from '../../utils/file.utils';

export function runPrettier(filePaths: string[]) {
  try {
    const prettier = require('prettier');
    const options = prettier.resolveConfig.sync(filePaths[0]);
    if (options) {
      for (const filePath of filePaths) {
        const formatted = prettier.format(readFile(filePath), {
          ...options,
          filepath: filePath,
        });
        writeFileSync(filePath, formatted);
      }
    }
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.warn('Failed to run prettier', e.message);
    }
  }
}
