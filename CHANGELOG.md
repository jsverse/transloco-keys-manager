# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2024-02-29)


### ⚠ BREAKING CHANGES

* comments inside a container with read will be prefixed with the read's
value
* changed config.

### Features

* 🎸 add config & project options ([000aff5](https://github.com/Nyffels-IT/transloco-keys-manager/commit/000aff53006850ab24fcb663754371a3afe54335)), closes [#17](https://github.com/Nyffels-IT/transloco-keys-manager/issues/17)
* 🎸 add option to delete missing keys ([e19baa9](https://github.com/Nyffels-IT/transloco-keys-manager/commit/e19baa95baf66674cb6a993913766f5230106f55))
* 🎸 Add support for angular 14 inject() ([#142](https://github.com/Nyffels-IT/transloco-keys-manager/issues/142)) ([0d69c07](https://github.com/Nyffels-IT/transloco-keys-manager/commit/0d69c07c344231b4797dd56319303e2241c7715f))
* 🎸 add support for function marker, not in a comment ([#60](https://github.com/Nyffels-IT/transloco-keys-manager/issues/60)) ([7c8636a](https://github.com/Nyffels-IT/transloco-keys-manager/commit/7c8636a452bc116e911e1c33db48bcd442bba2da)), closes [#59](https://github.com/Nyffels-IT/transloco-keys-manager/issues/59) [#59](https://github.com/Nyffels-IT/transloco-keys-manager/issues/59) [#59](https://github.com/Nyffels-IT/transloco-keys-manager/issues/59) [#59](https://github.com/Nyffels-IT/transloco-keys-manager/issues/59) [#59](https://github.com/Nyffels-IT/transloco-keys-manager/issues/59)
* 🎸 add support for read in comments ([9b6093a](https://github.com/Nyffels-IT/transloco-keys-manager/commit/9b6093aafad80d380d07d234cc013ade089db870))
* 🎸 detect keys in pipes args ([#115](https://github.com/Nyffels-IT/transloco-keys-manager/issues/115)) ([063c39f](https://github.com/Nyffels-IT/transloco-keys-manager/commit/063c39fd06586b29afe85664efb1f3859065e399)), closes [#114](https://github.com/Nyffels-IT/transloco-keys-manager/issues/114)
* 🎸 exclude comments as extra keys in detective ([6bef047](https://github.com/Nyffels-IT/transloco-keys-manager/commit/6bef047683f437c2de0a1f710f7e3d1fc105ecb0)), closes [#56](https://github.com/Nyffels-IT/transloco-keys-manager/issues/56)
* 🎸 exit code 2 if extra keys found ([#39](https://github.com/Nyffels-IT/transloco-keys-manager/issues/39)) ([3f8602c](https://github.com/Nyffels-IT/transloco-keys-manager/commit/3f8602c7946e08970a217a110c076a3e2faec6d7)), closes [#34](https://github.com/Nyffels-IT/transloco-keys-manager/issues/34) [#34](https://github.com/Nyffels-IT/transloco-keys-manager/issues/34) [#34](https://github.com/Nyffels-IT/transloco-keys-manager/issues/34) [#34](https://github.com/Nyffels-IT/transloco-keys-manager/issues/34)
* 🎸 extend the default value replaceable options ([4f6cdbc](https://github.com/Nyffels-IT/transloco-keys-manager/commit/4f6cdbcae77eab35024272c413b0aed40674b688))
* 🎸 run prettier on generated files ([6386b09](https://github.com/Nyffels-IT/transloco-keys-manager/commit/6386b092fb833752ffe1a898424290f2fe4c0f4f)), closes [#79](https://github.com/Nyffels-IT/transloco-keys-manager/issues/79)
* 🎸 support inline loaders and add nested option ([080a318](https://github.com/Nyffels-IT/transloco-keys-manager/commit/080a3183b202e02bff6502f6cb5e8bfd5cc6824d))
* 🎸 support inline templates ([a0b9eaa](https://github.com/Nyffels-IT/transloco-keys-manager/commit/a0b9eaa55bb0de94c587d6b0689fb2bd3e203d1a)), closes [#83](https://github.com/Nyffels-IT/transloco-keys-manager/issues/83)
* 🎸 support key injection in custom default value ([581d933](https://github.com/Nyffels-IT/transloco-keys-manager/commit/581d933ab7e7f153f72d29148711636640450c45)), closes [#8](https://github.com/Nyffels-IT/transloco-keys-manager/issues/8)
* 🎸 support library extraction ([3d6c287](https://github.com/Nyffels-IT/transloco-keys-manager/commit/3d6c287c0e6ce81f4379be5b727d55b8c2b90508)), closes [#54](https://github.com/Nyffels-IT/transloco-keys-manager/issues/54)
* 🎸 support marker ([06d47bc](https://github.com/Nyffels-IT/transloco-keys-manager/commit/06d47bc1ee6b798beaf41390e4d7edc48253e3e6))
* 🎸 support multiple input paths ([f6f21ab](https://github.com/Nyffels-IT/transloco-keys-manager/commit/f6f21ab1f001e77d74b8954e292b2d71ca082656)), closes [#40](https://github.com/Nyffels-IT/transloco-keys-manager/issues/40)
* 🎸 support project level config ([0cb4bbd](https://github.com/Nyffels-IT/transloco-keys-manager/commit/0cb4bbd55b456f500a5ef7cb2e28c67f216dec68)), closes [#116](https://github.com/Nyffels-IT/transloco-keys-manager/issues/116)
* 🎸 support ternary operator in structural directive ([#47](https://github.com/Nyffels-IT/transloco-keys-manager/issues/47)) ([440d8d3](https://github.com/Nyffels-IT/transloco-keys-manager/commit/440d8d3c2b842ae911c91f8827b98d4dd631adba))
* 🎸 support workspace.json configs ([953deaa](https://github.com/Nyffels-IT/transloco-keys-manager/commit/953deaa90a4a96b009f024124b182271ce6af86a)), closes [#72](https://github.com/Nyffels-IT/transloco-keys-manager/issues/72)
* 🎸 support workspaces without root configs ([2a8bbe8](https://github.com/Nyffels-IT/transloco-keys-manager/commit/2a8bbe8ee98b1492a189858838abcef897571194)), closes [#149](https://github.com/Nyffels-IT/transloco-keys-manager/issues/149)
* 🎸 update script to work with transloco v2 ([1db6527](https://github.com/Nyffels-IT/transloco-keys-manager/commit/1db65276571762186394ac3d09d32ba961b4870d))
* 🎸 use jsonc-parser to parse configs ([#147](https://github.com/Nyffels-IT/transloco-keys-manager/issues/147)) ([66a5cde](https://github.com/Nyffels-IT/transloco-keys-manager/commit/66a5cde716139f01ce38ab7dd88a26ba68aa3e14))
* support pot format for the translation files ([#124](https://github.com/Nyffels-IT/transloco-keys-manager/issues/124)) ([658c4b0](https://github.com/Nyffels-IT/transloco-keys-manager/commit/658c4b005eaf5b5d8212844ac5abe111e7b09123)), closes [#45](https://github.com/Nyffels-IT/transloco-keys-manager/issues/45)


### Bug Fixes

* 🐛 add fs-extra as a dependency ([7b58b6d](https://github.com/Nyffels-IT/transloco-keys-manager/commit/7b58b6d7ac62dbcee114777c170525961e927abd)), closes [#13](https://github.com/Nyffels-IT/transloco-keys-manager/issues/13)
* 🐛 add polyfill to support older node versions ([57a3e8d](https://github.com/Nyffels-IT/transloco-keys-manager/commit/57a3e8d901b23388364594148dcd98898c41dceb))
* 🐛 bad import ([dfbda7e](https://github.com/Nyffels-IT/transloco-keys-manager/commit/dfbda7e285cb1d1b3c04a60a4699ca197a20f03a))
* 🐛 cli messages ([2997755](https://github.com/Nyffels-IT/transloco-keys-manager/commit/2997755b3a6b93ed2d4a21d14853a87a3b8a7f56)), closes [#95](https://github.com/Nyffels-IT/transloco-keys-manager/issues/95)
* 🐛 cli options invalid alias ([c43a439](https://github.com/Nyffels-IT/transloco-keys-manager/commit/c43a439158770774e041782a3cd57cff29628aaa)), closes [#19](https://github.com/Nyffels-IT/transloco-keys-manager/issues/19)
* 🐛 comments extractions and pipe ([3f8414b](https://github.com/Nyffels-IT/transloco-keys-manager/commit/3f8414b3c57c331487826a13f62acc5cc4388b80))
* 🐛 exit the process when missing keys ([4029ad2](https://github.com/Nyffels-IT/transloco-keys-manager/commit/4029ad27c1b6dc20261b51a967963d037e2e3ddf))
* 🐛 extract keys from template attrs ([e27d750](https://github.com/Nyffels-IT/transloco-keys-manager/commit/e27d75096303bc5fc7fc787566fd591ed58b5e0d)), closes [#119](https://github.com/Nyffels-IT/transloco-keys-manager/issues/119)
* 🐛 extraction remove spaces from keys ([6cd78ce](https://github.com/Nyffels-IT/transloco-keys-manager/commit/6cd78ceeebd95bcf24cc780efbd7cb6f5e941d8f)), closes [#26](https://github.com/Nyffels-IT/transloco-keys-manager/issues/26)
* 🐛 false positive of prefix+marker(keys) inside comments ([#104](https://github.com/Nyffels-IT/transloco-keys-manager/issues/104)) ([eb71f58](https://github.com/Nyffels-IT/transloco-keys-manager/commit/eb71f58d53d0719a5f27e2c95d41feae68df748f))
* 🐛 fix issues found in tests ([ebe5711](https://github.com/Nyffels-IT/transloco-keys-manager/commit/ebe5711bb327798cddef39ee9ca503e668b2a9ae))
* 🐛 fix paths and angular.json file read ([b3f41c3](https://github.com/Nyffels-IT/transloco-keys-manager/commit/b3f41c30655798455e9dd124753eff920e8f2c05))
* 🐛 fix PC directory path conflict ([#9](https://github.com/Nyffels-IT/transloco-keys-manager/issues/9)) ([3e01c08](https://github.com/Nyffels-IT/transloco-keys-manager/commit/3e01c083c5631ad12db85b446755f35a467405bf))
* 🐛 fix pipe regex ([8efc008](https://github.com/Nyffels-IT/transloco-keys-manager/commit/8efc0087e74a77637da6f3c4070639aaabca5c67)), closes [#43](https://github.com/Nyffels-IT/transloco-keys-manager/issues/43)
* 🐛 fix scope mapping ([84e0e20](https://github.com/Nyffels-IT/transloco-keys-manager/commit/84e0e20ffe40ce06db72c0d896929ae595c1f6de))
* 🐛 fix scope mapping ([1d7e94e](https://github.com/Nyffels-IT/transloco-keys-manager/commit/1d7e94e6df20707083bf79682e99835031c8d1fa))
* 🐛 fix scope mapping ([3cd9921](https://github.com/Nyffels-IT/transloco-keys-manager/commit/3cd9921ef7cde0d3d1cd9d24fb9ffb31e835e0df))
* 🐛 handle empty keys ([71655e4](https://github.com/Nyffels-IT/transloco-keys-manager/commit/71655e42b9634b18e2b0c7b07532d82a2d748bc3)), closes [#30](https://github.com/Nyffels-IT/transloco-keys-manager/issues/30)
* 🐛 handle pipes in interpolation ([#111](https://github.com/Nyffels-IT/transloco-keys-manager/issues/111)) ([bfbfec3](https://github.com/Nyffels-IT/transloco-keys-manager/commit/bfbfec376f8f4dbff707ae0164bbf5d5e28648e8)), closes [#109](https://github.com/Nyffels-IT/transloco-keys-manager/issues/109) [#109](https://github.com/Nyffels-IT/transloco-keys-manager/issues/109)
* 🐛 import for @ngneat/transloco-utils ([#113](https://github.com/Nyffels-IT/transloco-keys-manager/issues/113)) ([e8ee33b](https://github.com/Nyffels-IT/transloco-keys-manager/commit/e8ee33bf6063fcf8e80a909d0fa279729704d920))
* 🐛 include only marking comments in the template ([8883135](https://github.com/Nyffels-IT/transloco-keys-manager/commit/8883135eb5bcd7dfd0d71a74804e4aa339b1e5ed)), closes [#10](https://github.com/Nyffels-IT/transloco-keys-manager/issues/10)
* 🐛 keys detective flatten files before comparing ([f87b128](https://github.com/Nyffels-IT/transloco-keys-manager/commit/f87b12838a1a3ed8eba69964a6f4cd1ef4689184))
* 🐛 keys detective should find global keys ([2e38f8c](https://github.com/Nyffels-IT/transloco-keys-manager/commit/2e38f8c04da2c883253f4666acddcd7155c73a62)), closes [#12](https://github.com/Nyffels-IT/transloco-keys-manager/issues/12)
* 🐛 Keys Extractor does not extract key arrays ([#112](https://github.com/Nyffels-IT/transloco-keys-manager/issues/112)) ([852ccee](https://github.com/Nyffels-IT/transloco-keys-manager/commit/852ccee9a8ffda5dd71657649c9a93be79b9facf))
* 🐛 normalized glob.sync calls ([#152](https://github.com/Nyffels-IT/transloco-keys-manager/issues/152)) ([1ec3d1b](https://github.com/Nyffels-IT/transloco-keys-manager/commit/1ec3d1b99dac584fa2cdc96637a57295d87c7e99))
* 🐛 pipe and sort keys when creating file ([d411550](https://github.com/Nyffels-IT/transloco-keys-manager/commit/d4115501234d44e8e162397ed7d53be9912edaab))
* 🐛 regex should look for full word template key only ([#18](https://github.com/Nyffels-IT/transloco-keys-manager/issues/18)) ([9d8cb86](https://github.com/Nyffels-IT/transloco-keys-manager/commit/9d8cb862d0a2edd490e8555917c3a95c6babd687))
* 🐛 remove legacy code which changed extracted keys ([ee46e00](https://github.com/Nyffels-IT/transloco-keys-manager/commit/ee46e001cba0ff78a9d3437600503f405fc79165)), closes [#7](https://github.com/Nyffels-IT/transloco-keys-manager/issues/7)
* 🐛 respect the langs in webpack plugin ([10891ee](https://github.com/Nyffels-IT/transloco-keys-manager/commit/10891ee3d5c37cee79f01fcf8f2badd4a392647a)), closes [#5](https://github.com/Nyffels-IT/transloco-keys-manager/issues/5)
* 🐛 scope mapping throws an error ([c696694](https://github.com/Nyffels-IT/transloco-keys-manager/commit/c69669416574bc35db8f3935261846a87f1577f1)), closes [#136](https://github.com/Nyffels-IT/transloco-keys-manager/issues/136)
* 🐛 scoped comments were added on a global level ([f2b00be](https://github.com/Nyffels-IT/transloco-keys-manager/commit/f2b00be8b7b8ed35c942d5f94242aa83107bfd57)), closes [#50](https://github.com/Nyffels-IT/transloco-keys-manager/issues/50)
* 🐛 scopes map taken from the wrong config ([1a2c7e2](https://github.com/Nyffels-IT/transloco-keys-manager/commit/1a2c7e2d585dd5c3eabb2d16f10f53521667eed6)), closes [#37](https://github.com/Nyffels-IT/transloco-keys-manager/issues/37)
* 🐛 should ignore unrelated methods ([b4ae85a](https://github.com/Nyffels-IT/transloco-keys-manager/commit/b4ae85ad8d3f88b09ec970d9a8a2711222f157fd))
* 🐛 should ignore unrelated methods ([04f71e8](https://github.com/Nyffels-IT/transloco-keys-manager/commit/04f71e89e696675b05e14c9e73608c103304599e))
* 🐛 should not override the existing keys ([268644d](https://github.com/Nyffels-IT/transloco-keys-manager/commit/268644d45bb35e4b34d5a40b76a3e311c3fccbe9)), closes [#1](https://github.com/Nyffels-IT/transloco-keys-manager/issues/1)
* 🐛 sort on all levels if using unflat ([#22](https://github.com/Nyffels-IT/transloco-keys-manager/issues/22)) ([bab0a57](https://github.com/Nyffels-IT/transloco-keys-manager/commit/bab0a572ffff56f94273cd22f980d96f57c86358))
* 🐛 support empty string as default value ([0f80435](https://github.com/Nyffels-IT/transloco-keys-manager/commit/0f80435f90e4e73433853727c3604a9cf843d482)), closes [#31](https://github.com/Nyffels-IT/transloco-keys-manager/issues/31)
* 🐛 support scopes with array as value ([425f34c](https://github.com/Nyffels-IT/transloco-keys-manager/commit/425f34c9b08ac50d1c493ab83ebec8b9de773a98)), closes [#128](https://github.com/Nyffels-IT/transloco-keys-manager/issues/128)
* 🐛 take first project from config if no default ([0c8f1bb](https://github.com/Nyffels-IT/transloco-keys-manager/commit/0c8f1bbcfeca3ca5a8a9133d2f82042316eb0637))
* 🐛 templateKey regex ([d5c5485](https://github.com/Nyffels-IT/transloco-keys-manager/commit/d5c54858bf6311f52bc715f9df21042a44085232)), closes [#70](https://github.com/Nyffels-IT/transloco-keys-manager/issues/70)
* 🐛 ts keys extraction ([97a786d](https://github.com/Nyffels-IT/transloco-keys-manager/commit/97a786d3ac640710f0ff1c38d73643953096f52a)), closes [#11](https://github.com/Nyffels-IT/transloco-keys-manager/issues/11)
* 🐛 unflatten with number as last key ([#16](https://github.com/Nyffels-IT/transloco-keys-manager/issues/16)) ([cb2cf07](https://github.com/Nyffels-IT/transloco-keys-manager/commit/cb2cf07e3dcf5bb493af5ec5096070dbe7feb276))
* 🐛 update buggy dep ([a028b0c](https://github.com/Nyffels-IT/transloco-keys-manager/commit/a028b0cbde413d5df8dd8d9a50550dcf400bead7)), closes [#121](https://github.com/Nyffels-IT/transloco-keys-manager/issues/121)
* 🐛 update vulnerable deps ([de2e4a3](https://github.com/Nyffels-IT/transloco-keys-manager/commit/de2e4a3061b4b118080290e55f7f93072a404c0a)), closes [#123](https://github.com/Nyffels-IT/transloco-keys-manager/issues/123)
* 🐛 use webpack 5's modified file list when available ([#99](https://github.com/Nyffels-IT/transloco-keys-manager/issues/99)) ([6466972](https://github.com/Nyffels-IT/transloco-keys-manager/commit/6466972a30724d942745547c6e61b9de679de2eb)), closes [#98](https://github.com/Nyffels-IT/transloco-keys-manager/issues/98)
* 🐛 validate directory paths ([d936b01](https://github.com/Nyffels-IT/transloco-keys-manager/commit/d936b017a124da74c039dc933f31e770039f5fa0)), closes [#21](https://github.com/Nyffels-IT/transloco-keys-manager/issues/21)
* 🐛 webpack wrong extraction when unflat with several langs ([33cb1cb](https://github.com/Nyffels-IT/transloco-keys-manager/commit/33cb1cbb7b475a6e4f3f38f5b148932e6b3a88b4)), closes [#46](https://github.com/Nyffels-IT/transloco-keys-manager/issues/46)
* 🐛 wrong pipe extraction ([7d1d848](https://github.com/Nyffels-IT/transloco-keys-manager/commit/7d1d8484a89d36f706037baacd43099de8303612)), closes [#32](https://github.com/Nyffels-IT/transloco-keys-manager/issues/32)
* added a glob ignore to the `resolveProjectBasePath` ([#150](https://github.com/Nyffels-IT/transloco-keys-manager/issues/150)) ([111bc3f](https://github.com/Nyffels-IT/transloco-keys-manager/commit/111bc3f991f998f0b99c464778c61a1235fdbc5c))
* only seach ts files for scopes ([#164](https://github.com/Nyffels-IT/transloco-keys-manager/issues/164)) ([d3e583f](https://github.com/Nyffels-IT/transloco-keys-manager/commit/d3e583fd15ee20cd072e865501e5c5da2724103a))
* writeFileSync expects encoding to be in lowercase ([#157](https://github.com/Nyffels-IT/transloco-keys-manager/issues/157)) ([9ba5f61](https://github.com/Nyffels-IT/transloco-keys-manager/commit/9ba5f618a8d08dac3c009adb87261f90ea352505))


* 💡 change base path default value and behavior ([3f7729f](https://github.com/Nyffels-IT/transloco-keys-manager/commit/3f7729fb320dcae6bf841da1ea61b376ab11333a))

## [0.0.1] (2024-02-29)

### Features
* Added function "markerDefault" as a marker function with the option to add a default value. 

### Init
* Forked "jsverse/transloco-keys-manager" on 2024-02-29.
