export function forEachKey(content: string, regex, cb) {
  let result = regex.exec(content);

  while (result) {
    /** Support ternary operator */
    const { backtickKey , backtickScope, scope, key, key2 } = result.groups;
    if (!(key || key2 || backtickKey)) {
      result = regex.exec(content);
      continue;
    }

    const keys = key2
        ? [key, key2]
        : [(key || backtickKey).replace(/'|"/g, '')];

    /**
     *
     * When this is a template `currentKey` is the full key from the template include scope: `someScope.title`
     * When this is a service `currentKey` is only the key because `scope` is the third function parameter: `title`
     *
     */
    for (const currentKey of keys) {
      const scopePath = scope || backtickScope;
      cb(currentKey, scopePath);
    }

    result = regex.exec(content);
  }
}
