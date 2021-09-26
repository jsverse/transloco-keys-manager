import * as fs from 'fs-extra';

import { resolveProjectBasePath } from '../src/utils/resolve-project-base-path';

describe('resolveProjectBasePath', () => {
  function addAngularConfig() {
    fs.writeJsonSync('angular.json', {
      defaultProject: 'defaultProject',
      projects: {
        defaultProject: { projectType: 'application', sourceRoot: 'testDir' },
        myProject: { projectType: 'library', sourceRoot: 'myRoot' },
      },
    });
  }

  function removeAngularConfig() {
    fs.removeSync('angular.json');
  }

  it('should return the default "src"', () => {
    expect(resolveProjectBasePath().projectBasePath).toBe('src');
  });

  describe('with angular config', () => {
    beforeAll(() => {
      addAngularConfig();
    });
    afterAll(() => {
      removeAngularConfig();
    });

    it('should return the source root of the default project', () => {
      const { projectBasePath, projectType } = resolveProjectBasePath();
      expect(projectBasePath).toBe('testDir');
      expect(projectType).toBe('application');
    });

    it('should return the source root of the given project', () => {
      const { projectBasePath, projectType } =
        resolveProjectBasePath('myProject');
      expect(projectBasePath).toBe('myRoot');
      expect(projectType).toBe('library');
    });
  });
});
