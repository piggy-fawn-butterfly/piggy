import { piggy } from "../piggy";

/**
 * @format
 * @file i18n
 * @description 国际化方案
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class i18n {
  ctor() {
    //默认国际化语言是中文
    this.m_lang = piggy.enums.E_Language_Choice.SC;
  }

  /**
   * 获得/设置当前语言
   * @fires EVENT_NAME.ON_LANGUAGE_CHANGED
   */
  get language() {
    return this.m_lang;
  }
  set language( lang ) {
    this.m_lang = lang;
    piggy.events.dispatch( piggy.constants.EVENT_NAME.ON_LANGUAGE_CHANGED );
  }

  /**
   * @description
   * - cn: 根据key和language获得i18n文本
   * - en: Obtain i18n text based on key and language
   * @param {string} key i18n text key
   * @param {string} lang i18n target language, default as `CN`
   */
  t( key, lang = this.m_lang ) {
    try {
      return piggy.locales[ lang ][ key ];
    } catch ( e ) {
      return "i18n failed";
    }
  }
}
