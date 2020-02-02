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

Comments in the templates will now **inherit the `read` [input](https://netbasal.gitbook.io/transloco/translation-in-the-template/structural-directive#utilizing-the-read-input) value** (if exists), and will be prefixed with it:
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