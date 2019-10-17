import * as fs from "fs";

/**
 * Verifies that the output dir (and sub-dirs) exists, if not create them.
 */
export function verifyOutputDir(outputPath, folders) {
  const scopes = folders.filter(key => key !== '__global');

  if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  for(const scope of scopes) {
    if(!fs.existsSync(`${outputPath}/${scope}`)) {
      fs.mkdirSync(`${outputPath}/${scope}`, { recursive: true });
    }
  }

}
