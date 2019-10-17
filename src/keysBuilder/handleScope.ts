export function handleScope({ scopeStr, key, inner, scopes }) {
  let scope = scopes.scopeMap[scopeStr];

  if(scope) {
    inner.unshift(key);
    key = scope;

    return [key, inner];
  }

  const splitted = scopeStr.split('/');
  splitted.pop();
  scope = splitted.join('/');

  if(scope && scopes.scopeMap[scope]) {
    inner.unshift(key);
    key = scopes.scopeMap[scope];
  }

  return [key, inner];
}
