import * as fs from 'fs';

export function readFile(file: string) {
  return fs.readFileSync(file, { encoding: 'utf-8' });
}
