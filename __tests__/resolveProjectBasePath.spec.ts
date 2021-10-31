import * as fs from 'fs-extra';

import { resolveProjectBasePath } from '../src/utils/resolve-project-base-path';

function jsonFile(name: string) {
  return name + '.json';
}

const defaultConfig = {
  defaultProject: 'defaultProject',
  projects: {
    defaultProject: { projectType: 'application', sourceRoot: 'testDir' },
    myProject: { projectType: 'library', sourceRoot: 'myRoot' },
  },
};

describe('resolveProjectBasePath', () => {
  const supportedConfigs = ['angular', 'workspace'];

  function addConfig(configType: string, config: any = defaultConfig) {
    fs.writeJsonSync(jsonFile(configType), config);
  }

  function removeAngularConfig(configType: string) {
    fs.removeSync(jsonFile(configType));
  }

  function assertDefaultProject() {
    const { projectBasePath, projectType } = resolveProjectBasePath();
    expect(projectBasePath).toBe('testDir');
    expect(projectType).toBe('application');
  }

  it('should return the default "src"', () => {
    expect(resolveProjectBasePath().projectBasePath).toBe('src');
  });

  it('should work when having both Angular and Workspace config', () => {
    addConfig('angular');
    addConfig('workspace', { otherStuff: true });
    assertDefaultProject();
    supportedConfigs.forEach(removeAngularConfig);
    addConfig('workspace');
    addConfig('angular', { otherStuff: true });
    assertDefaultProject();
    supportedConfigs.forEach(removeAngularConfig);
  });

  supportedConfigs.forEach((configType) => {
    describe(`${configType} config`, () => {
      beforeAll(() => {
        addConfig(configType);
      });

      afterAll(() => {
        supportedConfigs.forEach(removeAngularConfig);
      });

      it('should return the source root of the default project', () => {
        assertDefaultProject();
      });

      it('should return the source root of the given project', () => {
        const { projectBasePath, projectType } =
          resolveProjectBasePath('myProject');
        expect(projectBasePath).toBe('myRoot');
        expect(projectType).toBe('library');
      });
    });
  });
});
