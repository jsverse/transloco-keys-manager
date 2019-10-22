import { Scopes } from '../types';

const scopeToAlias: Scopes['scopeToAlias'] = {};
const aliasToScope: Scopes['aliasToScope'] = {};

export function addScope(scope: string, alias: string) {
  scopeToAlias[scope] = alias;
  aliasToScope[alias] = scope;
}

export function getScopes() {
  return { scopeToAlias, aliasToScope }
}

export function hasScope(scope: string) {
  return scopeToAlias.hasOwnProperty(scope);
}

