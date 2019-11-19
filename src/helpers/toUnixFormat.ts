import * as path from 'path';

export function toUnixFormat(p) {
  return p.split(path.sep).join('/');
}
