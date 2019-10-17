import * as fs from "fs";

export function createJson(outputPath, json) {
  fs.writeFileSync(outputPath, json, 'utf8');
}
