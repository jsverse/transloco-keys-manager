export abstract class Defaults {
  private constructor() {}

  public static _defaults: {key: string, defaultTranslation: string}[] = [];

  public static addDefault(key: string, defaultTranslation: string): void {
    this._defaults.push({key, defaultTranslation});
  }
}