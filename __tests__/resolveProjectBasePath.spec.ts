import * as fs from 'fs-extra';
import {resolveProjectBasePath} from "../src/helpers/resolveProjectBasePath";

describe('resolveProjectBasePath', () => {
    function addAngularConfig() {
        fs.writeJsonSync('angular.json', {
            defaultProject: 'defaultProject',
            projects: {
                defaultProject: {sourceRoot: 'testDir'},
                myProject: {sourceRoot: 'myRoot'},
            }
        });
    }

    function removeAngularConfig() {
        fs.removeSync('angular.json');
    }

    it('should return the default "src"', () => {
        expect(resolveProjectBasePath()).toBe('src');
    });

    describe('with angular config', () => {
        beforeAll(() => {
            addAngularConfig();
        });
        afterAll(() => {
            removeAngularConfig();
        });

        it('should return the source root of the default project', () => {
            expect(resolveProjectBasePath()).toBe('testDir');
        });

        it('should return the source root of the given project', () => {
            expect(resolveProjectBasePath('myProject')).toBe('myRoot');
        });
    });
});