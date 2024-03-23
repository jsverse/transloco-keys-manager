import fs from 'node:fs';
// const glob = require("glob");
// const terser = require("terser");

// const [,,mode] = process.argv;
copyAssets();

function copyAssets() {
  const {
    scripts,
    devDependencies,
    ['lint-staged']: _,
    config,
    husky,
    ...cleanPackage
  } = JSON.parse(fs.readFileSync('package.json').toString());
  fs.writeFileSync('dist/package.json', JSON.stringify(cleanPackage, null, 2));
  fs.copyFileSync('README.md', 'dist/README.md');
}

// function minify() {
//     glob.sync('dist/**/*.js').forEach(async (filePath) => {
//         const {code} = await terser.minify(fs.readFileSync(filePath, "utf8"));
//         fs.writeFileSync(filePath, code);
//     });
// }
