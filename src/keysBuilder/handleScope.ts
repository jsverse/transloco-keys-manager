import { ScopeMap } from '../types';

type Params = {
  // scope name todos <===.title
  key: string;
  scopeStr: string; // scope name from service?
  inner: string; // todos. ===>title
  scopes: ScopeMap;
};

export function handleScope({ scopeStr, key, inner, scopes }) {

  console.log(arguments);

  let scope = scopes.scopeToAlias[scopeStr];

  if (scope) {
    inner.unshift(key);
    key = scope;

    return [key, inner];
  }

  const splitted = scopeStr.split('/');
  splitted.pop();
  scope = splitted.join('/');

  if (scope && scopes.scopeToAlias[scope]) {
    inner.unshift(key);
    key = scopes.scopeToAlias[scope];
  }

  return [key, inner];
}
