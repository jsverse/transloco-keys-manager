import * as fs from 'fs';

export function isDirectory(path): boolean {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}
