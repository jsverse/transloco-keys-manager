import { resetScopes } from '../../src/keys-builder/utils/scope.utils';
import { spyOnConsole, spyOnProcess } from '../spec-utils';
import { testAddMissingKeysConfig } from './add-missing-keys/add-missing-keys-spec';
import { describe, beforeAll, afterEach } from 'vitest';

describe('findMissingKeys', () => {
  beforeAll(() => {
    spyOnConsole('warn');
    spyOnProcess('exit');
  });

  // Reset to ensure the scopes are not being shared among the tests.
  afterEach(() => resetScopes());

  testAddMissingKeysConfig();
});
