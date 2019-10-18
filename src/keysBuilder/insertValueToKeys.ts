import { messages } from '../messages';

/**
 * Insert a given key to the right place in the keys map.
 * 1. If this is a scoped key, enter to the correct scope.
 * 2. If this is a global key, enter to the reserved '__global' key in the map.
 */
export function insertValueToKeys({ inner, scopeToKeys, scopes, key, defaultValue }) {
  const fullKey = inner.length ? `${key}.${inner.join('.')}` : key;
  const keyValue = defaultValue || `${messages.missingValue} '${fullKey}'`;
  const scope = scopes.aliasToScope[key];

  if(scope) {
    if(!scopeToKeys[scope]) {
      scopeToKeys[scope] = {};
    }
    scopeToKeys[scope][inner.join('.')] = keyValue;
  } else {
    scopeToKeys.__global[fullKey] = keyValue;
  }
}
