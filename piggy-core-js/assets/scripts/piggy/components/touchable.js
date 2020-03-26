/**
 * @file touchable
 * @description 触摸控制组件
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export default touchable = cc.Class({
  extends: cc.Component,
  editor: {
    disallowMultiple: true
  },
  properties: {
    p_default_open: {
      displayName: "默认开启",
      default: true
    }
  },
  ctor() {
    this._down_in_callback = null;
    this._down_out_callback = null;
    this._up_in_callback = null;
    this._up_out_callback = null;
    this._move_in_callback = null;
    this._move_out_callback = null;
    this._move_callback = null;
  },

  /**
   * 第一次加载
   */
  onLoad() {
    this.reset();
    this.p_default_open ? this.on() : this.off();
  },

  /**
   * 开启触摸
   */
  on() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onDownIn, this);
    this.node.on(cc.Node.EventType.TOUCH_OUT, this._onDownOut, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onMove, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE_IN, this._onMoveIn, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE_OUT, this._onMoveOut, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onUpIn, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onUpOut, this);
  },

  /**
   * 关闭触摸
   */
  off() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onDownIn, this);
    this.node.off(cc.Node.EventType.TOUCH_OUT, this._onDownOut, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onMove, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE_IN, this._onMoveIn, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE_OUT, this._onMoveOut, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onUpIn, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onUpOut, this);
  },

  /**
   * 播放点击音效
   */
  playClick() {
    piggy.sound.play(assets.Sound_ButtonClick, false, false);
  },

  /**
   * 在节点内部触摸开始
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  _onDownIn(event) {
    this._down_in_callback && this._down_in_callback.call(this, event);
  },

  /**
   * 在节点外部触摸开始
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  _onDownOut(event) {
    this._down_out_callback && this._down_out_callback.call(this, event);
  },

  /**
   * 触摸移动
   * @param event 触摸事件
   */
  _onMove(event) {
    this._move_callback && this._move_callback.call(this, event);
  },

  /**
   * 从节点外部移入
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  _onMoveIn(event) {
    this._move_in_callback && this._move_in_callback.call(this, event);
  },

  /**
   * 从节点内部移出
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  _onMoveOut(event) {
    this._move_out_callback && this._move_out_callback.call(this, event);
  },

  /**
   * 在节点内部抬起
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  _onUpIn(event) {
    this._up_in_callback && this._up_in_callback.call(this, event);
  },

  /**
   * 在节点外部抬起
   * @param {cc.Event.EventTouch} event 触摸事件
   */
  _onUpOut(event) {
    this._up_out_callback && this._up_out_callback.call(this, event);
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setDownInCallback(callback) {
    this._down_in_callback = callback;
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setDownOutCallback(callback) {
    this._down_out_callback = callback;
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setMoveInCallback(callback) {
    this._move_in_callback = callback;
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setMoveOutCallback(callback) {
    this._move_out_callback = callback;
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setMoveCallback(callback) {
    this._move_callback = callback;
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setUpInCallback(callback) {
    this._up_in_callback = callback;
  },

  /**
   * 设置在节点内部触摸开始回调
   * @param {Function} callback 触摸回调
   */
  setUpOutCallback(callback) {
    this._up_out_callback = callback;
  },

  /**
   * 重置
   */
  reset() {
    this._down_in_callback = null;
    this._down_out_callback = null;
    this._move_callback = null;
    this._move_in_callback = null;
    this._move_out_callback = null;
    this._up_in_callback = null;
    this._up_out_callback = null;
  }
});
