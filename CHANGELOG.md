# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.2] (2024-03-01)

### Fixes
* Bugfix located and fixed that prevented the default value generation when using nested pipes. 

## [1.0.1] (2024-03-01)

### Fixes
* Several bugfixes and improvements. 

## [1.0.0] (2024-03-01)

### Changes 
* Removed "missing value" string as default for translations. 

### Features 
* Added cli and settings options for "useMarkerDefaults" and "defaultLanguage" parameters.
* Added "workdir" parameter to set the working directory
* Updated marker function to allow a translation value for the default language (set on extraction).
* Added extraction of default values set in code (ts and html pipe). 
 
### Init
* Forked "jsverse/transloco-keys-manager" on 2024-02-29.