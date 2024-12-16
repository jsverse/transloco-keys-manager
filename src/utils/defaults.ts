import { AST } from '@angular/compiler';

export abstract class Defaults {
  private constructor() {}

  public static _defaults: {key: string, defaultTranslation: string}[] = [];
  public static _defaultLanguage: string = "en";
  public static _defaultOverwrite: boolean = false;

  public static setConfigDefaults(iso: string, overwrite: boolean) {
    this._defaultLanguage = iso;
    this._defaultOverwrite = overwrite;
  }

  public static pipeExtractorDefaults(paramsNode: AST, key: string) {
    let defaultTranslation = '';
    const defaultIndex = (paramsNode as any).keys.findIndex(
      (e: any) => e.key.toLowerCase() === 'default',
    );
    if (defaultIndex >= 0) {
      defaultTranslation = (paramsNode as any).values[defaultIndex].value;
    }
    this._defaults.push({key, defaultTranslation});
  }
}