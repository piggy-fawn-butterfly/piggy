/**
 * @file App
 * @description 游戏入口组件
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

import { i18n } from "./i18n";
import { VERSION_STRING } from "../Const/Constant";
import { E_Locale_Keys } from "../Const/Locale/_Locale";
import { E_Version_Choice, E_Language_Choice } from "../Const/Declare/Enums";

const {
  ccclass,
  property,
  playOnFocus,
  disallowMultiple,
  executeInEditMode,
  requireComponent
} = cc._decorator;

/**
 * App游戏入口
 * @summary 要求:
 * - 必须挂载在`Canvas`下
 */
@ccclass
@playOnFocus
@disallowMultiple
@executeInEditMode
@requireComponent(cc.Canvas)
export class App extends cc.Component {
  resetInEditor() {
    this._init();
    this._p_version_string = VERSION_STRING;
  }
  onFocusInEditor() {
    this._init();
  }
  onLostFocusInEditor() {
    this._init();
  }
  onRestore() {
    this._init();
  }

  /**
   * 选择语言
   */
  @property()
  _p_i18n_language: E_Language_Choice = E_Language_Choice.CN;
  @property({
    displayName: i18n.text(E_Locale_Keys.editor_choose_language),
    type: cc.Enum(E_Language_Choice)
  })
  get p_i18n_language(): E_Language_Choice {
    return this._p_i18n_language;
  }
  set p_i18n_language(lang: E_Language_Choice) {
    this._p_i18n_language = lang;
    i18n.language = lang;
  }

  /**
   * 版本号
   * @summary 规则:
   * - 结构: 主版本号.次版本号.小版本号
   * - 版本号必须是非负整数
   */
  @property()
  _p_version_string: string = VERSION_STRING;
  @property({
    displayName: i18n.text(E_Locale_Keys.editor_version_code),
    type: cc.String
  })
  get p_version_string(): string {
    return this._p_version_string;
  }
  set p_version_string(str: string) {
    let arr = str.split(".");
    if (arr.length !== 3) {
      cc.warn(i18n.text(E_Locale_Keys.editor_invalid_version_rule));
      this.p_version_string = VERSION_STRING;
    } else {
      let ret = [];
      arr.forEach(code => {
        let num = Number(code);
        let meet = !isNaN(num) && num >= 0 && code[0] !== "-";
        num = meet ? num : 0;
        !meet &&
          cc.warn(i18n.text(E_Locale_Keys.editor_invalid_version_number));
        ret.push(num);
      });
      this._p_version_string = ret.join(".");
    }
  }

  /**
   * 版本状态
   */
  @property({
    displayName: i18n.text(E_Locale_Keys.editor_version_state),
    type: cc.Enum(E_Version_Choice)
  })
  p_version_state: E_Version_Choice = E_Version_Choice.Dev;

  /**
   * 是否开发版本
   */
  isDev() {
    return this.p_version_state === E_Version_Choice.Dev;
  }

  /**
   * 是否测试版本
   */
  isBeta() {
    return this.p_version_state === E_Version_Choice.Beta;
  }

  /**
   * 是否发布版本
   */
  isRelease() {
    return this.p_version_state === E_Version_Choice.Release;
  }

  /**
   * 初始化
   */
  private _init() {
    this.lockCanvasAdapter();
  }

  /**
   * 锁定Canvas适配
   * 采用新的屏幕适配方案：SHOW_ALL + CanvasAdapter
   * @see {@link CanvasAdapter} for further information.
   * @see CanvasAdapter
   */
  private lockCanvasAdapter() {
    let canvas = this.node.getComponent(cc.Canvas);
    canvas.fitWidth = true;
    canvas.fitHeight = true;
  }
}
