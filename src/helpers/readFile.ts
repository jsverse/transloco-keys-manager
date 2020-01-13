import * as fs from 'fs';

export function readFile(file: string): string;
export function readFile(file: string, config: { parse: false }): string;
export function readFile(file: string, config: { parse: true }): object;
export function readFile(file: string, { parse }: { parse: boolean } = { parse: false }): string | object {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });

  if (parse) {
    return JSON.parse(content);
  }

  return content;
}
