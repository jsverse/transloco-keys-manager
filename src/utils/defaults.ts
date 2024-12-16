export abstract class Defaults {
  private constructor() {}

  public static _defaults: {key: string, defaultTranslation: string}[] = [];
  public static _defaultLanguage: string = "en";
  public static _defaultOverwrite: boolean = false;

  public static setDefaultLanguage(iso: string) {
    this._defaultLanguage = iso;
  }

  public static setDefaultOverwrite(overwrite: boolean) {
    this._defaultOverwrite = overwrite;
  }

  public static addDefault(key: string, defaultTranslation: string): void {
    this._defaults.push({key, defaultTranslation});
  }
}