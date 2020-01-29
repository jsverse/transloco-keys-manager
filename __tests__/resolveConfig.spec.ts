jest.mock('../src/helpers/resolveProjectPath', () => ({
    resolveProjectPath: jest.fn(() => ({sourceRoot: "test"}))
}));
import chalk from "chalk";
import {messages} from "../src/messages";
import {resolveConfig} from "../src/helpers/resolveConfig";
import {resolveProjectPath} from "../src/helpers/resolveProjectPath";

describe('resolveConfig', () => {
    const configPaths = ['input', 'output', 'translationsPath'];
    let spies;
    function shouldFail(prop: string, msg: 'pathDoesntExists' | 'pathIsNotDir') {
        expect(process.exit).toBeCalled();
        expect(console.log).toBeCalledWith(chalk.bgRed.black(`${prop} ${messages[msg]}`));
        resetSpies();
    }

    function shouldPass() {
        expect(process.exit).not.toBeCalled();
        expect(console.log).not.toBeCalled();
        resetSpies();
    }

    function resetSpies() {
        spies.forEach(s => s.calls.reset());
    }

    it('should return the default config', () => {
        // TODO finish specs
    });

    describe('validate directories', () => {
        beforeEach(() => {
            spies = [spyOn(process, 'exit'), spyOn(console, 'log')];
        });
        it('should fail on invalid input path', () => {
            resolveConfig({input: '__tests__/noFolder'});
            shouldFail('Input', "pathDoesntExists");
            resolveConfig({input: '__tests__/comments/1.html'});
            shouldFail('Input', "pathIsNotDir");
        });
        it('should fail on invalid translations path', () => {
            /* should only fail translation path when in find mode */
            resolveConfig({input: '__tests__/comments', translationsPath: '__tests__/noFolder'});
            shouldPass();
            resolveConfig({input: '__tests__/comments', translationsPath: '__tests__/noFolder', command: 'extract'});
            shouldPass();
            resolveConfig({input: '__tests__/comments', translationsPath: '__tests__/noFolder', command: 'find'});
            shouldFail('Translations path', "pathDoesntExists");
            resolveConfig({input: '__tests__/comments', translationsPath: '__tests__/comments/1.html' , command: 'find'});
            shouldFail('Translations path', "pathIsNotDir");
        });
    });

    describe('resolveConfigPaths', () => {
        it('should prefix all the paths in the config with the process cwd',  () => {
            const config = resolveConfig({input: '__tests__/comments'});
            configPaths.forEach(p => expect(config[p].startsWith(process.cwd())).toBe(true));
        });
    });

    describe('resolveProjectPath', () => {
        it('should prefix the default paths with the project\'s source root' , () => {
            // TODO mock resolveProjectPath
            const config = resolveConfig({input: '__tests__/comments'});
            /* The input shouldn't be affected since it was provided by the user */
            expect(config.input.startsWith(`${process.cwd()}/__tests__/comments`)).toBe(true);
            ['output', 'translationsPath'].forEach(p => expect(config[p].startsWith(`${process.cwd()}/testRoot`)).toBe(true));
        });
    });

});