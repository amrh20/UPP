import { Injectable } from '@angular/core';
import * as coreEn from '../i18n/en';
import * as coreAr from '../i18n/ar';
import * as en from '../../app/i18n/en';
import * as ar from '../../app/i18n/ar';

@Injectable()
export class I18nService {
  private locales: {[key: string]: {[key: string]: string}};
  private coreLocales: {[key: string]: {[key: string]: string}};
  private language : string;

  constructor() {
    this.language = (window as any).wmConfig.language;
    this.coreLocales = {en: coreEn.default, ar: coreAr.default };
    this.locales = {en: en.default, ar: ar.default};
  }

  translate(key) {
    let result = null;
    try {
      result = this.coreLocales[this.language][key];
      if (!result) {
        result = this.locales[this.language][key];
      }
    }
    catch(e) {
      result = null;
    }
    return result || 'I18N key not found';
  }

  getLanguage() {
    return this.language;
  }
}
