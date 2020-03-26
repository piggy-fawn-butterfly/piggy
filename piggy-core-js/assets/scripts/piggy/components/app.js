import "../piggy";

/*
 * @file app
 * @function
 * @description 使用 `piggy` 初始化游戏应用
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 * @summary
 * - 请确保 `globals` 已导入为插件
 * - 不要忘了引入 piggy：`import "../piggy"`
 * - 游戏入口文件需继承此类，并且需要在 `onLoad` 中调用 `this._super()`
 * ```javascript
 * cc.Class({
 *  extends: require("path/to/app");
 *  onLoad() {
 *    this._super();
 *  }
 *  ...
 * })
 * ```
 */
export default app = cc.Class({
  extends: cc.Component,

  editor: {
    executionOrder: -1,
    executeInEditMode: true,
    disallowMultiple: true
  },

  properties: {
    /**
     * 开发模式
     */
    mode: {
      type: piggy.enums.E_Dev_Mode,
      default: piggy.enums.E_Dev_Mode.Debug
    },

    /**
     * 语言
     */
    lang: {
      type: piggy.enums.E_Language_Choice,
      default: piggy.enums.E_Language_Choice.SC
    }
  },

  onLoad() {
    piggy.app = this;
    piggy.mode.code = this.mode;
    piggy.i18n.set(this.lang);
    cc.game.on(cc.game.EVENT_SHOW, this.onAppShow, this);
    cc.game.on(cc.game.EVENT_HIDE, this.onAppHide, this);
  },

  /**
   * 应用进入前台
   * @fires app#onAppShow
   */
  onAppShow() {
    //TODO
    piggy.events.dispatch(piggy.constants.EVENT_NAME.ON_APP_SHOW);
  },

  /**
   * 应用进入后台
   * @fires app#onAppHide
   */
  onAppHide() {
    //TODO
    /**
     * @events app#piggy.constants.EVENT_NAME.ON_APP_HIDE
     */
    piggy.events.dispatch(piggy.constants.EVENT_NAME.ON_APP_HIDE);
  }
});
