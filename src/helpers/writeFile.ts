import * as fs from 'fs';

import { stringify } from './stringify';

export function writeFile(fileName: string, content: object) {
  return fs.writeFileSync(fileName, stringify(content), { encoding: 'UTF-8' });
}
