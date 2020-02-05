import { messages } from '../messages';
import { getLogger } from '../helpers/logger';

export function checkForProblematicUnflatKeys(obj: object) {
  const allKeys = Object.keys(obj).sort();
  const problematicKeys = [];
  const max = allKeys.length - 1;
  for (let i = 0; i < max; ) {
    const key = allKeys[i];
    const prefix = key + '.';
    let index = allKeys[++i].indexOf(prefix);
    if (index === 0) {
      problematicKeys.push(key);
      while (index === 0 && i <= max) {
        problematicKeys.push(allKeys[i]);
        index = i < max ? allKeys[++i].indexOf(prefix) : -1;
      }
    }
  }
  if (problematicKeys.length) {
    const logger = getLogger();
    logger.log('\x1b[31m%s\x1b[0m', '⚠️', messages.problematicKeysForUnflat(problematicKeys));
  }
}
