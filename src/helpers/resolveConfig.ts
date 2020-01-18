import {getConfig, TranslocoConfig} from '@ngneat/transloco-utils';
import {updateScopesMap} from './updateScopesMap';
import {Config} from '../types';
import {defaultConfig} from '../defaultConfig';
import {getScopes} from '../keysBuilder/scopes';
import {resolveProjectPath} from "./resolveProjectPath";
import * as debug from 'debug';
import chalk from 'chalk';
import * as fs from "fs";
import {messages} from "../messages";
import {isDirectory} from "./isDirectory";

export function resolveConfig(inlineConfig: Config): Config {
    const defaults = defaultConfig;
    let project;
    if (inlineConfig.project) {
        project = resolveProjectPath(inlineConfig.project);
    }
    const fileConfig = getConfig(inlineConfig.config || project?.root);
    const userConfig = {...flatFileConfig(fileConfig), ...inlineConfig};
    const config = {...defaults, ...userConfig};

    if (project) {
        const {sourceRoot} = project;
        /* Search for the config within the matching project */
        config.translationsPath = `${sourceRoot}/${userConfig.translationsPath ? config.translationsPath : 'assets/i18n'}`;
        config.input = `${sourceRoot}/${userConfig.input ? config.input : 'app'}`;
        config.output = `${sourceRoot}/${userConfig.output ? config.output : 'assets/i18n'}`;
    }

    if (debug.enabled('config')) {
        const log = debug('config');
        log(`Default: %o`, defaults);
        log(`Transloco file: %o`, flatFileConfig(fileConfig));
        log(`Inline: %o`, inlineConfig);
        log(`Merged: %o`, config);
    }

    resolveConfigPaths(config);
    validateDirectories(config);

    updateScopesMap({input: config.input});
    return {...config, scopes: getScopes()};
}

function flatFileConfig(fileConfig: TranslocoConfig) {
    const keysManager = fileConfig.keysManager || {};
    const {rootTranslationsPath, langs} = fileConfig;

    if (rootTranslationsPath) {
        keysManager['translationsPath'] = fileConfig.rootTranslationsPath;
    }

    if (langs) {
        keysManager['langs'] = fileConfig.langs;
    }

    return keysManager;
}

function resolveConfigPaths(config: Config) {
    ['input', 'output', 'translationsPath'].forEach((prop) => {
       config[prop] = `${process.cwd()}/${config[prop]}`;
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