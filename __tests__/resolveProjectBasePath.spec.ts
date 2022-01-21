import * as fs from 'fs-extra';
import path from 'path';

import { resolveProjectBasePath } from '../src/utils/resolve-project-base-path';

const supportedConfigs = ['angular', 'workspace'] as const;
const myProjectConfig = { projectType: 'library', sourceRoot: 'myRoot' };
const defaultConfig = {
  defaultProject: 'defaultProject',
  projects: {
    defaultProject: { projectType: 'application', sourceRoot: 'testDir' },
    myProject: myProjectConfig,
  },
};

describe('resolveProjectBasePath', () => {
  it('should return the default "src"', () => {
    expect(resolveProjectBasePath().projectBasePath).toBe('src');
  });

  it('should work when having both Angular and Workspace config', () => {
    addRootConfig({ configType: 'angular' });
    addRootConfig({ configType: 'workspace', config: { otherStuff: true } });
    assertDefaultProject();
    removeRootConfigs();
    addRootConfig({ configType: 'workspace' });
    addRootConfig({ configType: 'angular', config: { otherStuff: true } });
    assertDefaultProject();
    removeRootConfigs();
  });

  describe('Project level config', () => {
    const projectPath = 'packages/myProject';

    beforeAll(() => {
      addRootConfig({
        configType: 'angular',
        config: { projects: { myProject: projectPath } },
      });
      addProjectConfig({ path: projectPath });
    });

    afterAll(() => {
      removeRootConfigs();
      removeProjectConfig(projectPath);
    });

    it('should take the first project if no default project', () => {
      const { projectBasePath, projectType } = resolveProjectBasePath();
      expect(projectBasePath).toBe('myRoot');
      expect(projectType).toBe('library');
    });

    it('should resolve my project paths', () => {
      const { projectBasePath, projectType } =
        resolveProjectBasePath('myProject');
      expect(projectBasePath).toBe('myRoot');
      expect(projectType).toBe('library');
    });
  });

  supportedConfigs.forEach((configType) => {
    describe(`${configType} config`, () => {
      beforeAll(() => {
        addRootConfig({ configType });
      });

      afterAll(() => {
        removeRootConfigs();
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

function jsonFile(name: string, path?: string) {
  const base = path ? `${path}/` : '';

  return resolvePath(base + `${name}.json`);
}

function addProjectConfig({
  path,
  config = myProjectConfig,
}: {
  path: string;
  config?: any;
}) {
  fs.mkdirsSync(resolvePath(path));
  fs.writeJsonSync(jsonFile('project', path), config);
}

function removeProjectConfig(path: string) {
  removeConfigFile('project', path);
  fs.removeSync(resolvePath(path.split('/')[0]));
}

function addRootConfig({
  path,
  configType,
  config = defaultConfig,
}: {
  path?: string;
  configType: 'angular' | 'workspace';
  config?: any;
}) {
  fs.writeJsonSync(jsonFile(configType, path), config);
}

function removeConfigFile(configType: string, path?: string) {
  fs.removeSync(jsonFile(configType, path));
}

function assertDefaultProject() {
  const { projectBasePath, projectType } = resolveProjectBasePath();
  expect(projectBasePath).toBe('testDir');
  expect(projectType).toBe('application');
}

function removeRootConfigs() {
  supportedConfigs.forEach((config) => removeConfigFile(config));
}

function resolvePath(rest: string) {
  return path.resolve(process.cwd(), rest);
}
