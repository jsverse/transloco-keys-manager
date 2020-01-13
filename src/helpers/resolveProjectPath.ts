import {cosmiconfigSync} from 'cosmiconfig';

export function resolveProjectPath(project: string): {sourceRoot: string, root: string} {
    const result = cosmiconfigSync('angular').search();
    const {sourceRoot, root} = result?.config?.projects[project];
    return {sourceRoot, root};
}