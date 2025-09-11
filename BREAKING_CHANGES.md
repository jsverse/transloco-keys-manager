# Transloco Keys Manager V7

Support Angular 20

# Transloco Keys Manager V6

All the debug namespaces are now prefixed with `tkm:` to avoid conflicts with other libraries.  

# Transloco Keys Manager V5

The source root is now only prefixed to the **default** config, which means you need to write the full path relative to
the project root.
If I had the following config:

```ts
import {TranslocoGlobalConfig} from "@jsverse/transloco-utils";

const config: TranslocoGlobalConfig = {
   rootTranslationsPath: 'assets/i18n/',
   langs: ['it', 'en'],
   keysManager: {
       input: ['app'],
       output: 'assets/i18n/'
   },
}

export default config;
```

When migrating to v5 I'll need to prefix the paths with the source root:
```ts
import {TranslocoGlobalConfig} from "@jsverse/transloco-utils";

const config: TranslocoGlobalConfig = {
   //                     👇
   rootTranslationsPath: 'src/assets/i18n/',
   langs: ['it', 'en'],
   keysManager: {
       input: [
       //    👇
           'src/app', 
       // 🥳 Scanning non buildable libs is now supported
           'projects/ui-lib/src/lib'
       ],
       //        👇
       output: 'src/assets/i18n/'
   },
}

export default config;
```

This change is necessary to [allow scanning arbitrary folders](https://github.com/jsverse/transloco-keys-manager/issues/160) and will open support for a more dynamic features.

# Transloco Keys Manager V4

The library is now ESM only in order to use the newer versions of the angular compiler.
The publishing scope has changes from `@ngneat/transloco-keys-manager` to `@jsverse/transloco-keys-manager`,
this means you'll need to update the import paths of the marker functions in case you are using it.

# Transloco Keys Manager V2

#### Paths resolution

All the paths configuration (`input`, `output`, and `translationsPath`) will now be prefixed with the `sourceRoot` value.  
The `sourceRoot` value is determined by the following logic:  

1. `angular.json` file is missing:
    - Will default to `src`.    
2. `angular.json` file is present:
    - Will default to the `defaultProject`'s `sourceRoot` value.
    - If `--project` option is provided, will extract the project's `sourceRoot` value.

#### Dynamic Template Keys

Comments in the templates will now **inherit the `read` [input](https://jsverse.github.io/transloco/docs/structural-directive/#utilizing-the-read-input) value** (if exists), and will be prefixed with it:
```html
<!-- t(this.is.cool) -->
<ng-container *transloco="let m; read: 'messages'">
    ...
    <!-- t(success, error) -->
    <ng-container *transloco="let g; read: 'general'">
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
