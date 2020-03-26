/**
 * @file screenAdapter
 * @extends cc.Component
 * @requires cc.Widget
 * @description 屏幕适配方案
 * - 开启此组件时要求 `Canvas` 的适配模式必须是 `SHOW_ALL`
 * - 开启此组件意味着组件节点将会根据屏幕尺寸而非设计尺寸进行适配
 * - 此组件的适配方式基于 `cc.Widget` 的配置，跟普通适配一样操作即可
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export default screen_adapter = cc.Class({
  extends: cc.Component,
  properties: {},
  editor: {
    disallowMultiple: true,
    requireComponent: cc.Widget
  },

  /**
   * 启用
   */
  onEnable() {
    piggy.events.on(piggy.constants.EVENT_NAME.ON_CANVAS_RESIZE, this.adapt, this);
    this.adapt();
  },

  /**
   * 禁用
   */
  onDisable() {
    piggy.events.off(piggy.constants.EVENT_NAME.ON_CANVAS_RESIZE, this.adapt, this);
  },

  /**
   * 准备适配
   */
  adapt() {
    this.scheduleOnce(() => {
      this._doAdapt();
    }, 0);
  },

  /**
   * 全方位对齐到Canvas
   */
  adaptToCanvas() {
    let widget = this.node.getComponent(cc.Widget);
    widget.top = widget.bottom = widget.left = widget.right = 0;
    widget.isAlignTop = widget.isAlignBottom = widget.isAlignRight = widget.isAlignLeft = true;
    this.adapt();
  },

  /**
   * 执行适配
   */
  _doAdapt() {
    let widget = this.node.getComponent(cc.Widget);
    widget.alignMode = cc.Widget.AlignMode.ONCE;

    // 执行尺寸适配
    let { anchorX, anchorY } = this.node;
    let real_size = piggy.cocos.getCanvasRealSize();
    if (widget.isAlignBottom && widget.isAlignLeft && widget.isAlignTop && widget.isAlignRight) {
      let nw = real_size.width - widget.left - widget.right;
      let nh = real_size.height - widget.top - widget.bottom;
      this.node.setContentSize(nw, nh);
    } else if (widget.isAlignBottom && widget.isAlignTop) {
      let nh = real_size.height - widget.top - widget.bottom;
      this.node.height = nh;
    } else if (widget.isAlignLeft && widget.isAlignRight) {
      let nw = real_size.width - widget.left - widget.right;
      this.node.width = nw;
    }

    // 执行位置适配
    let rw = real_size.width * 0.5;
    let rh = real_size.height * 0.5;
    let nw = this.node.width * (1 - anchorX);
    let nh = this.node.height * (1 - anchorY);
    if (widget.isAlignLeft && !widget.isAlignRight) {
      this.node.x = -rw + nw + widget.left;
    } else if (widget.isAlignRight && !widget.isAlignLeft) {
      widget.isAlignRight && (this.node.x = rw - nw - widget.right);
    }
    if (widget.isAlignBottom && widget.isAlignTop) {
      this.node.y = -rh + nh + widget.bottom;
    } else if (widget.isAlignTop && !widget.isAlignBottom) {
      this.node.y = rh - nh - widget.top;
    }
  }
});
