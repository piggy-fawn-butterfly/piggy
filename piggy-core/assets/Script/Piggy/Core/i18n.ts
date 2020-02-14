import { locales, enums } from "../Const/_Const";

/**
 * @file i18n
 * @description 国际化方案
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 * @identifier
 * ```
 *             ╥━━━┳━━━━━━━━━╭━━╮━━━┳━━━╥
 *             ╢━D━┣ ╭╮╭━━━━━┫┃▋▋━▅ ┣━R━╢
 *             ╢━O━┣ ┃╰┫┈┈┈┈┈┃┃┈┈╰┫ ┣━E━╢
 *             ╢━O━┣ ╰━┫┈┈┈┈┈╰╯╰┳━╯ ┣━Y━╢
 *             ╢━O━┣ ┊┊┃┏┳┳━━┓┏┳┫┊┊ ┣━N━╢
 *             ╨━━━┻━━━┗┛┗┛━━┗┛┗┛━━━┻━━━╨
 * ```
 */
class i18n {
  public static s_instance: i18n = new i18n();

  //默认国际化语言是中文
  private m_lang: enums.E_Language_Choice = enums.E_Language_Choice.CN;

  /**
   * 获得/设置当前语言
   * @fires EVENT_NAME.ON_LANGUAGE_CHANGED
   */
  public get language(): enums.E_Language_Choice {
    return this.m_lang;
  }
  public set language(lang: enums.E_Language_Choice) {
    this.m_lang = lang;
    // globalEvent.dispatch(EVENT_NAME.ON_LANGUAGE_CHANGED);
  }

  /**
   * @description
   * - cn: 根据key和language获得i18n文本
   * - en: Obtain i18n text based on key and language
   * @param key i18n text key
   * @param lang i18n target language, default as `CN`
   */
  public text(
    key: locales.E_Text_Key,
    lang: enums.E_Language_Choice = this.m_lang
  ) {
    try {
      return locales[enums.E_Language_Choice[lang]][key];
    } catch (e) {
      return "i18n failed";
    }
  }
}

let _i18n = i18n.s_instance;

export { _i18n as i18n };
