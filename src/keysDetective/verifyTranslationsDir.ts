import * as fs from 'fs';
import chalk from 'chalk';
import * as glob from 'glob';
import { messages } from '../messages';

export function verifyTranslationsDir(path: string) {
  const fullPath = `${process.cwd()}/${path}`;
  const dirExists = fs.existsSync(fullPath);
  const files = dirExists && glob.sync(`${fullPath}/**/*.json`);

  if (!dirExists || files.length === 0) {
    const msg = dirExists ? messages.noTranslationFilesFound(fullPath) : messages.pathDoesntExists;
    return console.log(chalk.bgRed.black(`Transloco Keys Manager: ${msg}`));
  }

  return files;
}
