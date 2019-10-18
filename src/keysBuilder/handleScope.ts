export function handleScope({ scopeStr, key, inner, scopes }) {
  let scope = scopes.scopeToAlias[scopeStr];

  if(scope) {
    inner.unshift(key);
    key = scope;

    return [key, inner];
  }

  const splitted = scopeStr.split('/');
  splitted.pop();
  scope = splitted.join('/');

  if(scope && scopes.scopeToAlias[scope]) {
    inner.unshift(key);
    key = scopes.scopeToAlias[scope];
  }

  return [key, inner];
}
