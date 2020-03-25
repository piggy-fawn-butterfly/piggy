/**
 * @file i18n
 * @description i18n国际化
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class i18n {
  constructor() {
    //默认国际化语言是中文
    this.m_lang = piggy.enums.E_Language_Choice.SC;
  }

  /**
   * 获得当前语言
   * @returns {piggy.enums.E_Language_Choice}
   */
  get() {
    return this.m_lang;
  }

  /**
   * 设置当前语言
   * @param {piggy.enums.E_Language_Choice} lang
   */
  set(lang) {
    this.m_lang = lang;
    piggy.events.dispatch(piggy.constants.EVENT_NAME.ON_LANGUAGE_CHANGED);
  }

  /**
   * 判断当前语言
   * @param {piggy.enums.E_Language_Choice} lang
   */
  is(lang) {
    return this.m_lang === lang;
  }

  /**
   * 获得语言代码
   * @param {string} lang
   * @returns {string}
   */
  code(lang = this.m_lang) {
    return piggy.enums.E_Language_Choice[lang].toLowerCase();
  }

  /**
   * @description
   * - cn: 根据key和language获得i18n文本
   * - en: Obtain i18n text based on key and language
   * @param {string} key i18n text key
   * @param {string} lang i18n target language, default as `CN`
   * @returns {string}
   */
  t(key, lang = this.m_lang) {
    try {
      return piggy.locales[this.code(lang)][key];
    } catch (e) {
      return "i18n failed";
    }
  }
}
