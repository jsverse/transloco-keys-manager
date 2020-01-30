import {cosmiconfigSync} from 'cosmiconfig';

export function resolveProjectBasePath(projectName?: string): string {
    const result = cosmiconfigSync('angular', {searchPlaces: ['angular.json', '.angular.json']}).search();
    let sourceRoot;
    const config = result?.config;
    if (config) {
        projectName = projectName || config.defaultProject;
        sourceRoot = config.projects[projectName]?.sourceRoot;
    }
    return sourceRoot || 'src';
}