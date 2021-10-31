# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0](https://github.com/ngneat/transloco-keys-manager/compare/v3.0.4...v3.1.0) (2021-10-31)


### Features

* 🎸 support workspace.json configs ([953deaa](https://github.com/ngneat/transloco-keys-manager/commit/953deaa90a4a96b009f024124b182271ce6af86a)), closes [#72](https://github.com/ngneat/transloco-keys-manager/issues/72)

### [3.0.4](https://github.com/ngneat/transloco-keys-manager/compare/v3.0.3...v3.0.4) (2021-10-28)


### Bug Fixes

* 🐛 bad import ([dfbda7e](https://github.com/ngneat/transloco-keys-manager/commit/dfbda7e285cb1d1b3c04a60a4699ca197a20f03a))

### [3.0.3](https://github.com/ngneat/transloco-keys-manager/compare/v3.0.2...v3.0.3) (2021-10-28)

### [3.0.2](https://github.com/ngneat/transloco-keys-manager/compare/v3.0.1...v3.0.2) (2021-10-07)


### Bug Fixes

* 🐛 Keys Extractor does not extract key arrays ([#112](https://github.com/ngneat/transloco-keys-manager/issues/112)) ([852ccee](https://github.com/ngneat/transloco-keys-manager/commit/852ccee9a8ffda5dd71657649c9a93be79b9facf))

### [3.0.1](https://github.com/ngneat/transloco-keys-manager/compare/v3.0.0...v3.0.1) (2021-09-28)


### Bug Fixes

* 🐛 handle pipes in interpolation ([#111](https://github.com/ngneat/transloco-keys-manager/issues/111)) ([bfbfec3](https://github.com/ngneat/transloco-keys-manager/commit/bfbfec376f8f4dbff707ae0164bbf5d5e28648e8)), closes [#109](https://github.com/ngneat/transloco-keys-manager/issues/109) [#109](https://github.com/ngneat/transloco-keys-manager/issues/109)

## [3.0.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.7.5...v3.0.0) (2021-09-27)


### Features

* 🎸 run prettier on generated files ([6386b09](https://github.com/ngneat/transloco-keys-manager/commit/6386b092fb833752ffe1a898424290f2fe4c0f4f)), closes [#79](https://github.com/ngneat/transloco-keys-manager/issues/79)
* 🎸 support inline templates ([a0b9eaa](https://github.com/ngneat/transloco-keys-manager/commit/a0b9eaa55bb0de94c587d6b0689fb2bd3e203d1a)), closes [#83](https://github.com/ngneat/transloco-keys-manager/issues/83)

### [2.7.5](https://github.com/ngneat/transloco-keys-manager/compare/v2.7.4...v2.7.5) (2021-09-13)


### Bug Fixes

* 🐛 false positive of prefix+marker(keys) inside comments ([#104](https://github.com/ngneat/transloco-keys-manager/issues/104)) ([eb71f58](https://github.com/ngneat/transloco-keys-manager/commit/eb71f58d53d0719a5f27e2c95d41feae68df748f))

### [2.7.4](https://github.com/ngneat/transloco-keys-manager/compare/v2.7.3...v2.7.4) (2021-07-15)


### Bug Fixes

* 🐛 cli messages ([2997755](https://github.com/ngneat/transloco-keys-manager/commit/2997755b3a6b93ed2d4a21d14853a87a3b8a7f56)), closes [#95](https://github.com/ngneat/transloco-keys-manager/issues/95)

### [2.7.3](https://github.com/ngneat/transloco-keys-manager/compare/v2.7.2...v2.7.3) (2021-07-13)


### Bug Fixes

* 🐛 use webpack 5's modified file list when available ([#99](https://github.com/ngneat/transloco-keys-manager/issues/99)) ([6466972](https://github.com/ngneat/transloco-keys-manager/commit/6466972a30724d942745547c6e61b9de679de2eb)), closes [#98](https://github.com/ngneat/transloco-keys-manager/issues/98)

### [2.7.2](https://github.com/ngneat/transloco-keys-manager/compare/v2.7.1...v2.7.2) (2021-04-17)

### [2.7.1](https://github.com/ngneat/transloco-keys-manager/compare/v2.7.0...v2.7.1) (2020-12-12)


### Bug Fixes

* 🐛 templateKey regex ([d5c5485](https://github.com/ngneat/transloco-keys-manager/commit/d5c54858bf6311f52bc715f9df21042a44085232)), closes [#70](https://github.com/ngneat/transloco-keys-manager/issues/70)

## [2.7.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.6.0...v2.7.0) (2020-10-31)


### Features

* 🎸 extend the default value replaceable options ([4f6cdbc](https://github.com/ngneat/transloco-keys-manager/commit/4f6cdbcae77eab35024272c413b0aed40674b688))

## [2.6.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.5.0...v2.6.0) (2020-09-20)


### Features

* 🎸 support library extraction ([3d6c287](https://github.com/ngneat/transloco-keys-manager/commit/3d6c287c0e6ce81f4379be5b727d55b8c2b90508)), closes [#54](https://github.com/ngneat/transloco-keys-manager/issues/54)

## [2.5.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.4.2...v2.5.0) (2020-09-20)


### Features

* 🎸 exclude comments as extra keys in detective ([6bef047](https://github.com/ngneat/transloco-keys-manager/commit/6bef047683f437c2de0a1f710f7e3d1fc105ecb0)), closes [#56](https://github.com/ngneat/transloco-keys-manager/issues/56)

### [2.4.2](https://github.com/ngneat/transloco-keys-manager/compare/v2.4.1...v2.4.2) (2020-09-19)


### Bug Fixes

* 🐛 webpack wrong extraction when unflat with several langs ([33cb1cb](https://github.com/ngneat/transloco-keys-manager/commit/33cb1cbb7b475a6e4f3f38f5b148932e6b3a88b4)), closes [#46](https://github.com/ngneat/transloco-keys-manager/issues/46)

### [2.4.1](https://github.com/ngneat/transloco-keys-manager/compare/v2.4.0...v2.4.1) (2020-09-19)


### Bug Fixes

* 🐛 fix pipe regex ([8efc008](https://github.com/ngneat/transloco-keys-manager/commit/8efc0087e74a77637da6f3c4070639aaabca5c67)), closes [#43](https://github.com/ngneat/transloco-keys-manager/issues/43)

## [2.4.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.3.2...v2.4.0) (2020-09-19)


### Features

* 🎸 support ternary operator in structural directive ([#47](https://github.com/ngneat/transloco-keys-manager/issues/47)) ([440d8d3](https://github.com/ngneat/transloco-keys-manager/commit/440d8d3c2b842ae911c91f8827b98d4dd631adba))

### [2.3.2](https://github.com/ngneat/transloco-keys-manager/compare/v2.3.1...v2.3.2) (2020-09-19)

### [2.3.1](https://github.com/ngneat/transloco-keys-manager/compare/v2.3.0...v2.3.1) (2020-09-12)


### Bug Fixes

* 🐛 scoped comments were added on a global level ([f2b00be](https://github.com/ngneat/transloco-keys-manager/commit/f2b00be)), closes [#50](https://github.com/ngneat/transloco-keys-manager/issues/50)


### Tests

* 💍 rename specs ([edb1291](https://github.com/ngneat/transloco-keys-manager/commit/edb1291))



## [2.3.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.2.1...v2.3.0) (2020-09-12)


### Features

* 🎸 add support for function marker, not in a comment ([#60](https://github.com/ngneat/transloco-keys-manager/issues/60)) ([7c8636a](https://github.com/ngneat/transloco-keys-manager/commit/7c8636a452bc116e911e1c33db48bcd442bba2da)), closes [#59](https://github.com/ngneat/transloco-keys-manager/issues/59) [#59](https://github.com/ngneat/transloco-keys-manager/issues/59) [#59](https://github.com/ngneat/transloco-keys-manager/issues/59) [#59](https://github.com/ngneat/transloco-keys-manager/issues/59) [#59](https://github.com/ngneat/transloco-keys-manager/issues/59)

### [2.2.1](https://github.com/ngneat/transloco-keys-manager/compare/v2.2.0...v2.2.1) (2020-06-22)


### Bug Fixes

* 🐛 add polyfill to support older node versions ([57a3e8d](https://github.com/ngneat/transloco-keys-manager/commit/57a3e8d))



## [2.2.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.1.0...v2.2.0) (2020-06-21)


### Features

* 🎸 support multiple input paths ([f6f21ab](https://github.com/ngneat/transloco-keys-manager/commit/f6f21ab)), closes [#40](https://github.com/ngneat/transloco-keys-manager/issues/40)



## [2.1.0](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.7...v2.1.0) (2020-06-10)


### Features

* 🎸 exit code 2 if extra keys found ([#39](https://github.com/ngneat/transloco-keys-manager/issues/39)) ([3f8602c](https://github.com/ngneat/transloco-keys-manager/commit/3f8602c)), closes [#34](https://github.com/ngneat/transloco-keys-manager/issues/34) [#34](https://github.com/ngneat/transloco-keys-manager/issues/34) [#34](https://github.com/ngneat/transloco-keys-manager/issues/34) [#34](https://github.com/ngneat/transloco-keys-manager/issues/34)



### [2.0.7](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.6...v2.0.7) (2020-05-16)


### Bug Fixes

* 🐛 scopes map taken from the wrong config ([1a2c7e2](https://github.com/ngneat/transloco-keys-manager/commit/1a2c7e2)), closes [#37](https://github.com/ngneat/transloco-keys-manager/issues/37)



### [2.0.6](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.5...v2.0.6) (2020-04-29)


### Bug Fixes

* 🐛 wrong pipe extraction ([7d1d848](https://github.com/ngneat/transloco-keys-manager/commit/7d1d848)), closes [#32](https://github.com/ngneat/transloco-keys-manager/issues/32)



### [2.0.5](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.4...v2.0.5) (2020-04-28)



### [2.0.4](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.3...v2.0.4) (2020-04-28)


### Bug Fixes

* 🐛 handle empty keys ([71655e4](https://github.com/ngneat/transloco-keys-manager/commit/71655e4)), closes [#30](https://github.com/ngneat/transloco-keys-manager/issues/30)
* 🐛 support empty string as default value ([0f80435](https://github.com/ngneat/transloco-keys-manager/commit/0f80435)), closes [#31](https://github.com/ngneat/transloco-keys-manager/issues/31)



### [2.0.3](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.2...v2.0.3) (2020-03-14)



### [2.0.2](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.1...v2.0.2) (2020-02-03)


### Bug Fixes

* 🐛 extraction remove spaces from keys ([6cd78ce](https://github.com/ngneat/transloco-keys-manager/commit/6cd78ce)), closes [#26](https://github.com/ngneat/transloco-keys-manager/issues/26)



### [2.0.1](https://github.com/ngneat/transloco-keys-manager/compare/v2.0.0...v2.0.1) (2020-02-02)


### Bug Fixes

* 🐛 exit the process when missing keys ([4029ad2](https://github.com/ngneat/transloco-keys-manager/commit/4029ad2))



## [2.0.0](https://github.com/ngneat/transloco-keys-manager/compare/v1.3.2...v2.0.0) (2020-02-02)


### Bug Fixes

* 🐛 sort on all levels if using unflat ([#22](https://github.com/ngneat/transloco-keys-manager/issues/22)) ([bab0a57](https://github.com/ngneat/transloco-keys-manager/commit/bab0a57))
* 🐛 validate directory paths ([d936b01](https://github.com/ngneat/transloco-keys-manager/commit/d936b01)), closes [#21](https://github.com/ngneat/transloco-keys-manager/issues/21)


### Features

* 🎸 add support for read in comments ([9b6093a](https://github.com/ngneat/transloco-keys-manager/commit/9b6093a))


### refactor

* 💡 change base path default value and behavior ([3f7729f](https://github.com/ngneat/transloco-keys-manager/commit/3f7729f))


### Tests

* 💍 add config specs ([5cf747c](https://github.com/ngneat/transloco-keys-manager/commit/5cf747c))


### BREAKING CHANGES

* comments inside a container with read will be prefixed with the read's
value
* changed config.



### [1.3.2](https://github.com/ngneat/transloco-keys-manager/compare/v1.3.1...v1.3.2) (2020-01-13)


### Bug Fixes

* 🐛 fix paths and angular.json file read ([b3f41c3](https://github.com/ngneat/transloco-keys-manager/commit/b3f41c3))



### [1.3.1](https://github.com/ngneat/transloco-keys-manager/compare/v1.3.0...v1.3.1) (2020-01-13)


### Bug Fixes

* 🐛 cli options invalid alias ([c43a439](https://github.com/ngneat/transloco-keys-manager/commit/c43a439)), closes [#19](https://github.com/ngneat/transloco-keys-manager/issues/19)
* 🐛 regex should look for full word template key only ([#18](https://github.com/ngneat/transloco-keys-manager/issues/18)) ([9d8cb86](https://github.com/ngneat/transloco-keys-manager/commit/9d8cb86))



## [1.3.0](https://github.com/ngneat/transloco-keys-manager/compare/v1.2.6...v1.3.0) (2020-01-13)


### Bug Fixes

* 🐛 unflatten with number as last key ([#16](https://github.com/ngneat/transloco-keys-manager/issues/16)) ([cb2cf07](https://github.com/ngneat/transloco-keys-manager/commit/cb2cf07))


### Features

* 🎸 add config & project options ([000aff5](https://github.com/ngneat/transloco-keys-manager/commit/000aff5)), closes [#17](https://github.com/ngneat/transloco-keys-manager/issues/17)



### [1.2.6](https://github.com/ngneat/transloco-keys-manager/compare/v1.2.4...v1.2.6) (2019-12-17)


### Bug Fixes

* 🐛 add fs-extra as a dependency ([7b58b6d](https://github.com/ngneat/transloco-keys-manager/commit/7b58b6d)), closes [#13](https://github.com/ngneat/transloco-keys-manager/issues/13)
* 🐛 keys detective flatten files before comparing ([f87b128](https://github.com/ngneat/transloco-keys-manager/commit/f87b128))



### [1.2.4](https://github.com/ngneat/transloco-keys-manager/compare/v1.2.3...v1.2.4) (2019-12-03)


### Bug Fixes

* 🐛 keys detective should find global keys ([2e38f8c](https://github.com/ngneat/transloco-keys-manager/commit/2e38f8c)), closes [#12](https://github.com/ngneat/transloco-keys-manager/issues/12)
* 🐛 should ignore unrelated methods ([b4ae85a](https://github.com/ngneat/transloco-keys-manager/commit/b4ae85a))



### [1.2.2](https://github.com/ngneat/transloco-keys-manager/compare/v1.2.1...v1.2.2) (2019-11-25)


### Bug Fixes

* 🐛 ts keys extraction ([97a786d](https://github.com/ngneat/transloco-keys-manager/commit/97a786d)), closes [#11](https://github.com/ngneat/transloco-keys-manager/issues/11)



### [1.2.1](https://github.com/ngneat/transloco-keys-manager/compare/v1.2.0...v1.2.1) (2019-11-24)


### Bug Fixes

* 🐛 fix PC directory path conflict ([#9](https://github.com/ngneat/transloco-keys-manager/issues/9)) ([3e01c08](https://github.com/ngneat/transloco-keys-manager/commit/3e01c08))
* 🐛 include only marking comments in the template ([8883135](https://github.com/ngneat/transloco-keys-manager/commit/8883135)), closes [#10](https://github.com/ngneat/transloco-keys-manager/issues/10)



## [1.2.0](https://github.com/ngneat/transloco-keys-manager/compare/v1.1.0...v1.2.0) (2019-11-19)


### Bug Fixes

* 🐛 remove legacy code which changed extracted keys ([ee46e00](https://github.com/ngneat/transloco-keys-manager/commit/ee46e00)), closes [#7](https://github.com/ngneat/transloco-keys-manager/issues/7)
* 🐛 respect the langs in webpack plugin ([10891ee](https://github.com/ngneat/transloco-keys-manager/commit/10891ee)), closes [#5](https://github.com/ngneat/transloco-keys-manager/issues/5)


### Features

* 🎸 support key injection in custom default value ([581d933](https://github.com/ngneat/transloco-keys-manager/commit/581d933)), closes [#8](https://github.com/ngneat/transloco-keys-manager/issues/8)



## [1.1.0](https://github.com/ngneat/transloco-keys-manager/compare/v1.0.1...v1.1.0) (2019-11-12)


### Features

* 🎸 support inline loaders and add nested option ([080a318](https://github.com/ngneat/transloco-keys-manager/commit/080a318))



### [1.0.1](https://github.com/ngneat/transloco-keys-manager/compare/v1.0.0...v1.0.1) (2019-11-06)



## 1.1.0 (2019-11-06)


### Bug Fixes

* 🐛 comments extractions and pipe ([3f8414b](https://github.com/ngneat/transloco-keys-manager/commit/3f8414b))
* 🐛 pipe and sort keys when creating file ([d411550](https://github.com/ngneat/transloco-keys-manager/commit/d411550))
* 🐛 should not override the existing keys ([268644d](https://github.com/ngneat/transloco-keys-manager/commit/268644d)), closes [#1](https://github.com/ngneat/transloco-keys-manager/issues/1)



## 1.0.0 (2019-10-25)


### Bug Fixes

* 🐛 fix issues found in tests ([ebe5711](https://github.com/ngneat/transloco-keys-manager/commit/ebe5711))
* 🐛 fix scope mapping ([84e0e20](https://github.com/ngneat/transloco-keys-manager/commit/84e0e20))
* 🐛 fix scope mapping ([1d7e94e](https://github.com/ngneat/transloco-keys-manager/commit/1d7e94e))
* 🐛 fix scope mapping ([3cd9921](https://github.com/ngneat/transloco-keys-manager/commit/3cd9921))


### Features

* 🎸 support marker ([06d47bc](https://github.com/ngneat/transloco-keys-manager/commit/06d47bc))
* 🎸 update script to work with transloco v2 ([1db6527](https://github.com/ngneat/transloco-keys-manager/commit/1db6527))


### Tests

* 💍 Add testing playground ([555191a](https://github.com/ngneat/transloco-keys-manager/commit/555191a))



## 1.0.0 (2019-11-05)


### Bug Fixes

* 🐛 fix issues found in tests ([ebe5711](https://github.com/ngneat/transloco-keys-manager/commit/ebe5711))


### Features

* 🎸 update script to work with transloco v2 ([1db6527](https://github.com/ngneat/transloco-keys-manager/commit/1db6527))


### Tests

* 💍 Add testing playground ([555191a](https://github.com/ngneat/transloco-keys-manager/commit/555191a))
