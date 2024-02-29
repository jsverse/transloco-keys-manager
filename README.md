## Fork
This is a fork of jsverse/transloco-keys-manager. You can fellow the original documentation on their README page (https://github.com/jsverse/transloco-keys-manager). 
This README will only contain the newer functions. 

## Instalation 
```bash
npm install @nyffels/transloco-keys-manager
```

## configuration parameters

### workdir

```bash
transloco-keys-manager extract --workdir dir\to\path
```

#### Config file
workdir: String

#### Default
Directory where the application has been launched from. 

#### Usage 
Set the working directory for this parameter

## Functions

### marker
* This marker function is an expansion on the default marker function. It allows the user to add a default value string in code for the default language set in the settings. 