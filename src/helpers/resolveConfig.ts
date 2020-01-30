import {getConfig, TranslocoConfig} from '@ngneat/transloco-utils';
import {updateScopesMap} from './updateScopesMap';
import {Config} from '../types';
import {defaultConfig} from '../defaultConfig';
import {getScopes} from '../keysBuilder/scopes';
import {resolveProjectBasePath} from "./resolveProjectBasePath";
import * as debug from 'debug';
import chalk from 'chalk';
import * as fs from "fs";
import * as path from "path";
import {messages} from "../messages";
import {isDirectory} from "./isDirectory";

export function resolveConfig(inlineConfig: Config): Config {
    const defaults = defaultConfig;
    const projectBsePath = resolveProjectBasePath(inlineConfig.project);
    const fileConfig = getConfig(inlineConfig.config || projectBsePath);
    const userConfig = {...flatFileConfig(fileConfig), ...inlineConfig};
    const config = {...defaults, ...userConfig};

    if (debug.enabled('config')) {
        const log = debug('config');
        log(`Default: %o`, defaults);
        log(`Transloco file: %o`, flatFileConfig(fileConfig));
        log(`Inline: %o`, inlineConfig);
        log(`Merged: %o`, config);
    }

    resolveConfigPaths(config, projectBsePath);
    validateDirectories(config);

    updateScopesMap({input: config.input});
    return {...config, scopes: getScopes()};
}

function flatFileConfig(fileConfig: TranslocoConfig) {
    const keysManager: Partial<Config> = fileConfig.keysManager || {};
    const {rootTranslationsPath, langs} = fileConfig;

    if (rootTranslationsPath) {
        keysManager.translationsPath = rootTranslationsPath;
    }

    if (langs) {
        keysManager.langs = langs;
    }

    return keysManager;
}

function resolveConfigPaths(config: Config, sourceRoot: string) {
    ['input', 'output', 'translationsPath'].forEach((prop) => {
       config[prop] = path.resolve(process.cwd(), sourceRoot, config[prop]);
    });
}

function validateDirectories({input, translationsPath, command}: Config) {
    let invalidPath = false;
    const log = (path, prop) => {
        const msg = fs.existsSync(path) ? messages.pathIsNotDir : messages.pathDoesntExists;
        console.log(chalk.bgRed.black(`${prop} ${msg}`));
    };
    if (!isDirectory(input)) {
        invalidPath = true;
        log(input, 'Input');
    }
    if (command === 'find' && !isDirectory(translationsPath)) {
        invalidPath = true;
        log(translationsPath, 'Translations path');
    }
    invalidPath && process.exit();
}