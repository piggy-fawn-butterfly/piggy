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
 * - 游戏入口文件需继承此类
 * ```javascript
 * cc.Class({
 *  extends: require("path/to/app");
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
    console.log(piggy);
  }
});
