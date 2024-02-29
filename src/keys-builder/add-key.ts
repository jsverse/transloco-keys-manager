import { messages } from '../messages';
import { BaseParams } from '../types';
import { isNil } from '../utils/validators.utils';

interface AddKeysParams extends BaseParams {
  scopeAlias: string;
  keyWithoutScope: string;
}

export function addKey({
  defaultValue,
  scopeToKeys,
  scopeAlias,
  keyWithoutScope,
  scopes
}: AddKeysParams) {
  if (!keyWithoutScope) {
    return;
  }

  const scopePath = scopes.aliasToScope[scopeAlias];
  const keyWithScope = scopeAlias
    ? `${scopeAlias}.${keyWithoutScope}`
    : keyWithoutScope;
  const keyValue = isNil(defaultValue)
    ? ""
    : defaultValue
        .replace('{{key}}', keyWithScope)
        .replace('{{keyWithoutScope}}', keyWithoutScope)
        .replace('{{scope}}', scopeAlias);

  if (scopePath) {
    if (!scopeToKeys[scopePath]) {
      scopeToKeys[scopePath] = {};
    }
    scopeToKeys[scopePath][keyWithoutScope] = keyValue;
  } else {
    scopeToKeys.__global[keyWithoutScope] = keyValue;
  }
}
