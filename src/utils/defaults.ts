import { AST } from '@angular/compiler';
import ts from 'typescript';
import { FileFormats, Translation } from '../types';
import { getCurrentTranslation } from '../keys-builder/utils/get-current-translation';
import { getLogger } from './logger';

export abstract class Defaults {
  private constructor() {}

  private static _defaults: {key: string, defaultTranslation: string}[] = [];
  private static _defaultLanguage: string = "en";
  private static _defaultOverwrite: boolean = false;
  private static _updatedTranslations: string[] = [];

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

  public static markerExtractorDefaults(node:  ts.NodeArray<ts.Expression>) {
    const markerNodes = node.filter(e => (e?.parent as any)?.expression?.escapedText == "marker");
    if (markerNodes.length > 0) {
      const key = (markerNodes[0] as any).text
      const defaultTranslation = (markerNodes[1] as any)?.text ?? "";
      this._defaults.push({key, defaultTranslation});
    }
  }

  public static findUpdatedValuesInGlobalFiles(globalFiles: {path: string, lang: string}[], fileFormat: FileFormats) {
    const defaultGlobalFile = globalFiles.find((e: any) => e.lang .toLowerCase() == this._defaultLanguage.toLowerCase());
    if (defaultGlobalFile) {
      const currentTranslation = getCurrentTranslation({path: defaultGlobalFile.path, fileFormat});
      this._updatedTranslations = Object.keys(currentTranslation).filter(e => currentTranslation[e].length > 0 && this._defaults.find(d => d.key == e)?.defaultTranslation != currentTranslation[e]);
    }
  }

  public static handleTranslation(translation: Translation, currentTranslation: Translation, lang: string) {
    if (lang.toLowerCase() === this._defaultLanguage.toLowerCase()) {
      if (this._defaultOverwrite) {
        for (const key of Object.keys(translation)) {
          const isUpdate = this._updatedTranslations.includes(key);
          let oldValue = "";
          if (isUpdate) {
            oldValue = currentTranslation[key];
          }

          currentTranslation[key] = this._defaults.find(d => d.key == key)?.defaultTranslation ?? "";
          if (isUpdate) {
            const logger = getLogger();
            logger.log(`💪 Updated '${key}' from '${oldValue}' to '${currentTranslation[key]}'.`);
          }
        }
      } else {
        for (const key of Object.keys(translation).filter(e => currentTranslation[e].length == 0)) {
          currentTranslation[key] = this._defaults.find(d => d.key == key)?.defaultTranslation ?? "";
        }
      }
    } else {
      if (this._defaultOverwrite) {
        for (const key of this._updatedTranslations) {
          currentTranslation[key] = "";
        }
      }
    }

    return {translation, currentTranslation};
  }
}