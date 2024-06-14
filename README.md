<<<<<<< HEAD
# Transloco keys manager with extra functionality

## Fork
This is a fork of jsverse/transloco-keys-manager. You can fellow the original documentation on their README page (https://github.com/jsverse/transloco-keys-manager). 
This README will only contain the newer functions and parameters.

* workdir parameter to set a workdir for this application. 
* default value to a in-code translation string. Ideal for solo developers of small teams to set a base language and create a better readability to their translation tags. 

## Instalation 
```bash
npm install @nyffels/transloco-keys-manager
=======
> [!IMPORTANT]  
> The Transloco packages are now published under the **@jsverse** scope, update your dependencies to get the latest features 🚀

<p align="center">
 <img width="50%" height="50%" src="./logo.png">
</p>

> 🦄 The Key to a Better Translation Experience

![Build Status](https://github.com/jsverse/transloco-keys-manager/actions/workflows/ci.yml/badge.svg)
[![NPM Version](https://img.shields.io/npm/v/%40jsverse%2Ftransloco-keys-manager)](https://www.npmjs.com/package/@jsverse/transloco-keys-manager)

Translation is a tiresome and repetitive task. Each time we add new text, we need to create a new entry in the translation file, find the correct placement for it, etc. Moreover, when we delete existing keys, we need to remember to remove them from each translation file.

To make the process less burdensome, we've created two tools for the Transloco library, which will do the monotonous work for you.

## 🍻Features

- ✅ &nbsp;Extract Translate Keys
- ✅ &nbsp;Scopes Support
- ✅ &nbsp;Webpack Plugin
- ✅ &nbsp;Find Missing and Extra Keys

## 📖 Table of Contents

- [Installation](#-installation)
- [Keys Extractor](#-keys-extractor)
  - [CLI](#cli-usage)
  - [Webpack Plugin](#webpack-plugin)
  - [Scopes Support](#scopes-support)
  - [Inline loaders](#inline-loaders)
  - [Dynamic Keys](#dynamic-keys)
  - [Marker Function](#marker-function)
  - [Extra Support](#extra-support)
- [Keys Detective](#-keys-detective)
- [Options](#-options)
- [Transloco Config File](#transloco-config-file)
- [Debugging](#-debugging)

## 🌩 Installation

### Schematics

Assuming you've already added Transloco to your project, run the following schematics command:

```
ng g @jsverse/transloco:keys-manager
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
```

## configuration parameters

### workdir

<<<<<<< HEAD
```bash
transloco-keys-manager extract --workdir dir\to\path
=======
### Manual

Install the Transloco keys manager package via `yarn` or `npm` by running:
```shell script
npm i -D @jsverse/transloco-keys-manager
yarn add -D @jsverse/transloco-keys-manager
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
```

##### Config file
workdir: string

##### Default
Directory where the application has been launched from. 

##### Usage 
Set the working directory for this parameter

### default-language

```bash
transloco-keys-manager extract --default-language nl
```

##### Config file
defaultLanguage: string

##### Default
en

##### usage 
Set the default language for the default values set in code (optional). These default values will only be set for the given language. The other language files will listen to the original "default-value" parameter. If defaultValue option in code is left empty or null, then the "default-value" will be used as a fallback value.

### defaultPipeArg

```bash
transloco-keys-manager extract --default-pipe-arg Default
```

##### Config file
defaultPipeArgument: string

##### Default
Default

##### Usage 
Add this pipe argument to a transloco pipe to set a default value for the default language. 

### defaultOverrideExisting

<<<<<<< HEAD
```bash
transloco-keys-manager extract --default-override-existing
=======
In case you already have support for a custom Webpack config just add the `TranslocoExtractKeysWebpackPlugin` in your plugin list.

In case you need to add the support, you can use the keys manager [schematics command](#schematics), and it will do the work for you. (choose the Webpack Plugin option)

You should see a new file named `webpack-dev.config.js` configured with `TranslocoExtractKeysWebpackPlugin`:

```ts
// webpack-dev.config.js
import { TranslocoExtractKeysWebpackPlugin } from '@jsverse/transloco-keys-manager';

export default {
  plugins: [
    new TranslocoExtractKeysWebpackPlugin(config?),
  ]
};
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
```

##### Config file
defaultOverrideExisting: boolean

##### Default
false

##### Usage 
The default value will override the existing value on the default language. The non-default languages will not be adjusted or cleared. The console will show the keys in its log. 

## Functions

<<<<<<< HEAD
### marker
* This marker function is an expansion on the default marker function. It allows the user to add a default value string in code for the default language set in the settings. 
=======
The extractor supports [scopes](https://jsverse.github.io/transloco/docs/scope-configuration/) out of the box. When you define a new scope in the `providers` array:

```ts
import { TRANSLOCO_SCOPE, provideTranslocoScope } from '@jsverse/transloco';

@Component({
  templateUrl: './admin-page.component.html',
  providers: [
      { provide: TRANSLOCO_SCOPE, useValue: 'admin' },
      provideTranslocoScope('todo'),
      provideTranslocoScope(['another', {scope: 'reallyLong', alias: 'rl'}]),
  ]
})
export class AdminPageComponent {}
```

```html
<ng-container *transloco="let t">{{ t('admin.title') }}</ng-container>
```

It'll extract the scope (`admin` in our case) keys into the relevant folder:

```
📦 assets
 ┗ 📂 i18n
 ┃ ┣ 📂 admin
 ┃ ┃ ┣ 📜 en.json
 ┃ ┃ ┗ 📜 es.json
 ┃ ┣ 📜 en.json
 ┃ ┗ 📜 es.json
```

### Inline Loaders

Let's say that we're using the following [inline](https://jsverse.github.io/transloco/docs/inline-loaders) loader:

```ts
export const loader = ['en', 'es'].reduce((acc, lang) => {
  acc[lang] = () => import(`../i18n/${lang}.json`);
  return acc;
}, {});

@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'scopeName',
        loader
      }
    }
  ],
  declarations: [YourComponent],
  exports: [YourComponent]
})
export class FeatureModule {}
```

We can add it to the `scopePathMap` key in the `transloco.config.js` file:

```js
module.exports = {
  langs: ['en', 'es'],
  scopePathMap: {
    scopeName: 'src/app/feature/i18n'
  }
};
```

Now, it'll create the files in the provided folder.

### Dynamic Keys

There are times when we need to extract keys with values that may change during runtime. One example can be when you need to use a dynamic expression:

```ts
import { TranslocoService } from '@jsverse`/transloco';

class MyComponent {
  someMethod() {
    const value = translocoService.translate(`key.${type}.postfix`);
  }
}
```

To support such cases, you can add a special comment to your code, which tells the CLI to extract it. It can be added to Typescript files:

```ts
import { TranslocoService } from '@jsverse/transloco';

class MyComponent {
  /**
   * t(key.typeOne.postfix, key.typeTwo.postfix)
   * t(this.will.be.extracted)
   */
  someMethod() {
    const value = translocoService.translate(`key.${type}.postfix`);
  }
}
```

Or to templates:

```html
<!-- t(I.am.going.to.extract.it, this.is.cool) -->
<ng-container *transloco="let t">...</ng-container>
```

When using comments in the templates they will also **inherit the `prefix` [input](https://jsverse.github.io/transloco/docs/translation-in-the-template#utilizing-the-prefix-input) value** (if exists), and will be prefixed with it:
```html
<!-- t(this.is.cool) -->
<ng-container *transloco="let m; prefix: 'messages'">
  ...
  <!-- t(success, error) -->
  <ng-container *transloco="let g; prefix: 'general'">
    ...
    <!-- t(ok, cancel) -->
  </ng-container>
</ng-container>
```

The extracted keys for the code above will be:
```json
{
  "this.is.cool": "",
  "messages.success": "",
  "messages.error": "",
  "general.ok": "",
  "general.cancel": ""
}
```

*Notes:*
1. When using a Typescript file, you must have an `import { } from '@jsverse/transloco'` statement in it.
2. When using comments in your HTML files, they *must* contain only the markers without additional text.
   Here's an example for invalid comment:
   `<!-- For dropdown t(dynamic.1, dynamic.2) -->`

### Marker function

If you want to extract some standalone strings that are not part of any translation call (via the template or service)
you can wrap them with the marker function to tell the keys manager to extract them:
```ts
import { marker } from '@jsverse/transloco-keys-manager';

class MyClass {
  static titles = {
    username: marker('auth.username'), // ==> 'auth.username'
    password: marker('auth.password') // ==> 'auth.password'
  };
...
}
```
The marker function will return the string which was passed to it.
You can alias the marker function if needed:
```ts
import { marker as _ } from '@jsverse/transloco-keys-manager';

class MyClass {
  static titles = {
    username: _('auth.username'),
    password: _('auth.password')
  };
...
}
```

### Extra Support

- Supports for the `prefix` [input](https://jsverse.github.io/transloco/docs/translation-in-the-template#utilizing-the-prefix-input):

```html
<ng-container *transloco="let t; prefix: 'dashboard'">
  <h1>{{ t('title') }}</h1>

  <p>{{ t('desc') }}</p>
</ng-container>
```

The extracted keys for the code above will be:

```json
{
  "dashboard.title": "",
  "dashboard.desc": ""
}
```

- Supports **static** ternary operators:

```html
<!-- Supported by the transloco pipe and structural directive -->
<comp [placeholder]="condition ? 'keyOne' : 'keyTwo' | transloco"></comp>
<h1>{{ condition ? 'keyOne' : 'keyTwo' | transloco }}</h1>

<comp *transloco="let t; prefix: 'ternary'">
  <h1>{{ t(condition ? 'keyOne' : 'keyTwo') }}</h1>
</comp>
```

## 🕵 Keys Detective

This tool detects two things: First, it detects any key that exists in one of your translation files but is missing in any of the others. Secondly, it detects any key that exists in the translation files but is missing from any of the templates or typescript files.
After installing the library, you should see the following script in your project's `package.json` file:

```json
{
  "i18n:find": "transloco-keys-manager find"
}
```

Run `npm run i18n:find`, and you'll get a lovely list that summarizes the keys found.

## 🕹 Options

- `project`*: The targeted project (default is `defaultProject`). The `sourceRoot` of this project will be extracted from the `angular.json` file and will prefix the `input`, `output`, and `translationPath` properties.
  In addition, the transloco config file will be searched in the project's `sourceRoot` (unless the `config` option is passed):

```
transloco-keys-manager extract --project first-app
```

\* **Note:** If no `angular.json` file is present, `sourceRoot` will be `src`.

- `config`: The root search directory for the transloco config file: (default is `process.cwd()`)

```
transloco-keys-manager extract --config src/my/path
transloco-keys-manager extract -c src/my/path
```

- `input`: The source directory for all files using the translation keys: (default is `['app']`)

```
transloco-keys-manager extract --input src/my/path
transloco-keys-manager extract --input src/my/path,project/another/path
transloco-keys-manager extract -i src/my/path
```

\* **Note:** If a `project` is provided the default input value will be determined by the `projectType`, when given a library the default input value will be `['lib']`.

- `output`: The target directory for all generated translation files: (default is `assets/i18n`)

```
transloco-keys-manager extract --output my/path
transloco-keys-manager extract -o my/path
```

- `fileFormat`: The translation file format `'json' | 'pot'`: (default is `json`)

```
transloco-keys-manager extract --file-format pot
transloco-keys-manager extract -f pot
```

- `langs`: The languages files to generate: (default is `[en]`)

```
transloco-keys-manager extract --langs en es it
transloco-keys-manager extract -l en es it
```

- `marker`: The marker sign for dynamic values: (default is `t`)

```
transloco-keys-manager extract --marker _
transloco-keys-manager extract -m  _
```

- `sort`: Whether to sort the keys using JS `sort()` method: (default is `false`)

```
transloco-keys-manager extract --sort
```

- `unflat`: Whether to `unflat` instead of `flat`: (default is `flat`)

```
transloco-keys-manager extract --unflat
transloco-keys-manager extract -u
```

If you are using unflat files keep in mind that “parent” keys won't be usable for a separate translation value, i.e. if you have two keys `first` and `first.second` you cannot assign a value to `first` as the translation file will look like `{ "first": { "second": "…" } }`.

During key extraction you will get a warning with a list of concerned keys you have to check for.

- `defaultValue`: The default value of a generated key: (default is `Missing value for {{key}}`)

```
transloco-keys-manager extract --default-value missingValue
transloco-keys-manager extract -d "{{key}} translation is missing"
```
There are several placeholders that are replaced during extraction:
1. `{{key}}` - complete key including the scope.
2. `{{keyWithoutScope}}` - key value without the scope.
3. `{{scope}}` - the key's scope.


- `replace`: Replace the contents of a translation file (if it exists) with the generated one (default value is `false`, in which case files are merged)

```
transloco-keys-manager extract --replace
transloco-keys-manager extract -r
```

- `removeExtraKeys`: Remove extra keys from existing translation files (defaults to `false`)

```
transloco-keys-manager extract --remove-extra-keys
transloco-keys-manager extract -R
```

- `addMissingKeys`: Add missing keys that were found by the detective (default is `false`)

```
transloco-keys-manager find --add-missing-keys
transloco-keys-manager find -a
```

- `emitErrorOnExtraKeys`: Emit an error and exit the process if extra keys were found (default is `false`)

```
transloco-keys-manager find --emit-error-on-extra-keys
transloco-keys-manager find -e
```

- `translationsPath`: The path for the root directory of the translation files (default is `assets/i18n`)

```
transloco-keys-manager find --translations-path my/path
transloco-keys-manager find -p my/path
```

- `help`:

```
transloco-keys-manager --help
transloco-keys-manager -h
```

### Transloco Config File

One more option to define the `config` object for this library is to create a `transloco.config.js` file in the project's root folder and add the configuration in it:

```ts
// transloco.config.js
module.exports = {
  rootTranslationsPath?: string;
  langs?: string[];
  keysManager: {
    input?: string | string[];
    output?: string;
    fileFormat?: 'json' | 'pot';
    marker?: string;
    addMissingKeys?: boolean;
    emitErrorOnExtraKeys?: boolean;
    replace?: boolean;
    defaultValue?: string | undefined;
    unflat?: boolean;
  };
}
```

### 🐞 Debugging

You can extend the keys manager default logs by setting the `DEBUG` environment variable:
```json
{
  "i18n:extract": "DEBUG=* transloco-keys-manager extract",
  "i18n:find": "DEBUG=* transloco-keys-manager find"
}
```
Supported namespaces: `*|config|paths|scopes|extraction`, setting `*` will print all the debugger logs.

You can also chain several namespaces:
```json
{
  "i18n:extract": "DEBUG=config,paths transloco-keys-manager extract"
}
```

## Contributors ✨

Thank goes to all these wonderful [people who contributed](https://github.com/jsverse/transloco-keys-manager/graphs/contributors) ❤️
>>>>>>> 0106b9e9c2fa08458763e11c830b9c78b8465dc7
