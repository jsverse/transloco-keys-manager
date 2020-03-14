import { messages } from '../messages';
import { getLogger } from '../helpers/logger';

export function checkForProblematicUnflatKeys(obj: object) {
  const sortedKeys = Object.keys(obj).sort();
  const problematicKeys = [];
  const lastKeyIndex = sortedKeys.length - 1;
  for (let i = 0; i < lastKeyIndex; ) {
    const key = sortedKeys[i];
    const prefix = `${key}.`;
    let isChildKey = sortedKeys[++i].startsWith(prefix);
    if (isChildKey) {
      problematicKeys.push(key);
      while (isChildKey && i <= lastKeyIndex) {
        problematicKeys.push(sortedKeys[i]);
        isChildKey = i < lastKeyIndex && sortedKeys[++i].startsWith(prefix);
      }
    }
  }
  if (problematicKeys.length) {
    const logger = getLogger();
    logger.log('\x1b[31m%s\x1b[0m', '⚠️', messages.problematicKeysForUnflat(problematicKeys));
  }
}
