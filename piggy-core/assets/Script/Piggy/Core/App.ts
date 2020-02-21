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

import { i18n, i18ns } from "./i18n";
import { logger } from "./Logger";
import { event_center } from "./EventCenter";
import { enums } from "../Const/Declare/Enums";
import { constants } from "../Const/Constant";

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
class App extends cc.Component {
  //----------------------组件属性----------------------

  resetInEditor() {
    this.resetEditor();
    this._p_version_string = constants.VERSION_STRING;
  }
  onFocusInEditor() {
    this.resetEditor();
  }
  onLostFocusInEditor() {
    this.resetEditor();
  }
  onRestore() {
    this.resetEditor();
  }

  /**
   * 选择语言
   */
  @property()
  _p_i18n_language: enums.E_Language_Choice = enums.E_Language_Choice.CN;
  @property({
    displayName: i18ns.text(i18n.TextKey.editor_choose_language),
    type: cc.Enum(enums.E_Language_Choice)
  })
  get p_i18n_language(): enums.E_Language_Choice {
    return this._p_i18n_language;
  }
  set p_i18n_language(lang: enums.E_Language_Choice) {
    i18ns.language = this._p_i18n_language = lang;
  }

  /**
   * 版本号
   * @summary 规则:
   * - 结构: 主版本号.次版本号.小版本号
   * - 版本号必须是非负整数
   */
  @property()
  _p_version_string: string = constants.VERSION_STRING;
  @property({
    displayName: i18ns.text(i18n.TextKey.editor_version_code),
    type: cc.String
  })
  get p_version_string(): string {
    return this._p_version_string;
  }
  set p_version_string(str: string) {
    let arr = str.split(".");
    if (arr.length !== 3) {
      cc.warn(i18ns.text(i18n.TextKey.editor_invalid_version_rule));
      this.p_version_string = constants.VERSION_STRING;
    } else {
      let ret = [];
      arr.forEach(code => {
        let num = Number(code);
        let meet = !isNaN(num) && num >= 0 && code[0] !== "-";
        num = meet ? num : 0;
        !meet &&
          cc.warn(i18ns.text(i18n.TextKey.editor_invalid_version_number));
        ret.push(num);
      });
      this._p_version_string = ret.join(".");
    }
  }

  /**
   * 版本状态
   */
  @property({
    displayName: i18ns.text(i18n.TextKey.editor_version_state),
    type: cc.Enum(enums.E_Version_Choice)
  })
  p_version_state: enums.E_Version_Choice = enums.E_Version_Choice.Dev;

  /**
   * 浏览器自动满屏
   */
  @property({
    displayName: i18ns.text(i18n.TextKey.editor_auto_resize_for_browser),
    tooltip: i18ns.text(i18n.TextKey.editor_browser_only)
  })
  p_auto_resize_for_browser: boolean = false;

  //----------------------组件方法----------------------

  /**
   * 初始化
   */
  private resetEditor() {
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

  /**
   * 是否开发版本
   */
  isDev() {
    return this.p_version_state === enums.E_Version_Choice.Dev;
  }

  /**
   * 是否测试版本
   */
  isBeta() {
    return this.p_version_state === enums.E_Version_Choice.Beta;
  }

  /**
   * 是否发布版本
   */
  isRelease() {
    return this.p_version_state === enums.E_Version_Choice.Release;
  }

  /**
   * App首次加载
   */
  onLoad() {
    logger.setLevel(
      this.isRelease() ? enums.E_Log_Level.Error : enums.E_Log_Level.Trace
    );
    this.lockCanvasAdapter();
    this.registerCanvasResizeEvent();
  }

  /**
   * App销毁
   */
  onDestroy() {
    this.unschedule(this.refreshFrameSize);
  }

  /**
   * 监听Canvas尺寸变化
   */
  registerCanvasResizeEvent() {
    if (this.p_auto_resize_for_browser && cc.sys.isBrowser) {
      cc.view.enableAutoFullScreen(this.p_auto_resize_for_browser);
      let toolbar = document.getElementsByClassName("toolbar")[0];
      toolbar && (toolbar["style"]["display"] = "none");
      this.schedule(this.refreshFrameSize, 1);
      this.refreshFrameSize();
    } else {
      cc.view.on(constants.EVENT_NAME.ON_CANVAS_RESIZE, () => {
        event_center.dispatch(constants.EVENT_NAME.ON_CANVAS_RESIZE);
      });
    }
  }

  /**
   * 自动更新FrameSize
   */
  refreshFrameSize() {
    let frameSize = cc.view.getFrameSize();
    let { clientWidth, clientHeight } = document.body;
    if (
      Math.floor(frameSize.width - clientWidth) !== 0 ||
      Math.floor(frameSize.height - clientHeight) !== 0
    ) {
      cc.view.setFrameSize(clientWidth, clientHeight);
      event_center.dispatch(constants.EVENT_NAME.ON_CANVAS_RESIZE);
    }
  }
}

export { App as app };
