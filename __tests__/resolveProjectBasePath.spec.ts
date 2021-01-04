import * as fs from 'fs-extra';

import { resolveProjectBasePath } from '../src/helpers/resolveProjectBasePath';

describe('resolveProjectBasePath', () => {
  function addAngularConfig(configFile: string = 'angular.json') {
    fs.writeJsonSync(configFile, {
      defaultProject: 'defaultProject',
      projects: {
        defaultProject: { projectType: 'application', sourceRoot: 'testDir' },
        myProject: { projectType: 'library', sourceRoot: 'myRoot' }
      }
    });
  }

  function removeAngularConfig(configFile: string = 'angular.json') {
    fs.removeSync(configFile);
  }

  it('should return the default "src"', () => {
    expect(resolveProjectBasePath().projectBasePath).toBe('src');
  });

  describe.each([
    [undefined, 'angular.json'],
    ['workspace.json', 'workspace.json']
  ])('with workspace config as %s', (workspaceConfigPath, configFileName) => {
    describe('with angular config', () => {
      beforeAll(() => {
        addAngularConfig(configFileName);
      });
      afterAll(() => {
        removeAngularConfig(configFileName);
      });

      it('should return the source root of the default project', () => {
        const { projectBasePath, projectType } = resolveProjectBasePath(undefined, workspaceConfigPath);
        expect(projectBasePath).toBe('testDir');
        expect(projectType).toBe('application');
      });

      it('should return the source root of the given project', () => {
        const { projectBasePath, projectType } = resolveProjectBasePath('myProject', workspaceConfigPath);
        expect(projectBasePath).toBe('myRoot');
        expect(projectType).toBe('library');
      });
    });
  });
});
