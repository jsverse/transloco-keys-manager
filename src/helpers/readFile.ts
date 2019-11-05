import * as fs from 'fs';

export function readFile(file: string, { parse }: { parse: boolean } = { parse: false }) {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });

  if (parse) {
    return JSON.parse(content);
  }

  return content;
}
