import * as fs from 'fs';
import chalk from 'chalk';
import * as glob from 'glob';
import { messages } from '../messages';

export function getTranslationFilesPath(path: string): string[] {
  const dirExists = fs.existsSync(path);
  const files = dirExists && glob.sync(`${path}/**/*.json`);

  if (!dirExists) {
    const msg = messages.pathDoesntExists;
    console.log(chalk.bgRed.black(`Transloco Keys Manager: ${msg}`));
    return [];
  }

  return files;
}
