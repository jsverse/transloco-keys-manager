import * as fs from "fs";

/**
 * Verifies that the output dir (and sub-dirs) exists, if not create them.
 */
export function createDirs(outputPath: string, folders: string[]) {
  const scopes = folders.filter(key => key !== '__global');

  if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  for(const scope of scopes) {
    const path = `${outputPath}/${scope}`;
    if(!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }

}
