import { sound } from "../Sound";
import { assets } from "../../Const/Assets";

const { ccclass, property, disallowMultiple } = cc._decorator;

/**
 * @file Touchable
 * @description 触摸控制组件
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
@ccclass
@disallowMultiple
class Touchable extends cc.Component {
  private _down_in_callback: Function = null;
  private _down_out_callback: Function = null;
  private _up_in_callback: Function = null;
  private _up_out_callback: Function = null;
  private _move_in_callback: Function = null;
  private _move_out_callback: Function = null;
  private _move_callback: Function = null;

  @property({ displayName: "默认开启" })
  p_default_open: boolean = true;

  /**
   * 第一次加载
   */
  onLoad() {
    this.reset();
    this.p_default_open ? this.on() : this.off();
  }

  /**
   * 开启触摸
   */
  public on() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onDownIn, this);
    this.node.on(cc.Node.EventType.TOUCH_OUT, this._onDownOut, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onMove, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE_IN, this._onMoveIn, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE_OUT, this._onMoveOut, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onUpIn, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onUpOut, this);
  }

  /**
   * 关闭触摸
   */
  public off() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onDownIn, this);
    this.node.off(cc.Node.EventType.TOUCH_OUT, this._onDownOut, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onMove, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE_IN, this._onMoveIn, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE_OUT, this._onMoveOut, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onUpIn, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onUpOut, this);
  }

  /**
   * 播放点击音效
   */
  public playClick() {
    sound.play(assets.Sound_ButtonClick, false, false);
  }

  /**
   * 在节点内部触摸开始
   * @param event 触摸事件
   */
  private _onDownIn(event: cc.Event.EventTouch) {
    this._down_in_callback && this._down_in_callback.call(this, event);
  }

  /**
   * 在节点外部触摸开始
   * @param event 触摸事件
   */
  private _onDownOut(event: cc.Event.EventTouch) {
    this._down_out_callback && this._down_out_callback.call(this, event);
  }

  /**
   * 触摸移动
   * @param event 触摸事件
   */
  private _onMove(event: cc.Event.EventTouch) {
    this._move_callback && this._move_callback.call(this, event);
  }

  /**
   * 从节点外部移入
   * @param event 触摸事件
   */
  private _onMoveIn(event: cc.Event.EventTouch) {
    this._move_in_callback && this._move_in_callback.call(this, event);
  }

  /**
   * 从节点内部移出
   * @param event 触摸事件
   */
  private _onMoveOut(event: cc.Event.EventTouch) {
    this._move_out_callback && this._move_out_callback.call(this, event);
  }

  /**
   * 在节点内部抬起
   * @param event 触摸事件
   */
  private _onUpIn(event: cc.Event.EventTouch) {
    this._up_in_callback && this._up_in_callback.call(this, event);
  }

  /**
   * 在节点外部抬起
   * @param event 触摸事件
   */
  private _onUpOut(event: cc.Event.EventTouch) {
    this._up_out_callback && this._up_out_callback.call(this, event);
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setDownInCallback(callback: Function) {
    this._down_in_callback = callback;
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setDownOutCallback(callback: Function) {
    this._down_out_callback = callback;
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setMoveInCallback(callback: Function) {
    this._move_in_callback = callback;
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setMoveOutCallback(callback: Function) {
    this._move_out_callback = callback;
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setMoveCallback(callback: Function) {
    this._move_callback = callback;
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setUpInCallback(callback: Function) {
    this._up_in_callback = callback;
  }

  /**
   * 设置在节点内部触摸开始回调
   * @param callback 触摸回调
   */
  public setUpOutCallback(callback: Function) {
    this._up_out_callback = callback;
  }

  /**
   * 重置
   */
  public reset() {
    this._down_in_callback = null;
    this._down_out_callback = null;
    this._move_callback = null;
    this._move_in_callback = null;
    this._move_out_callback = null;
    this._up_in_callback = null;
    this._up_out_callback = null;
  }
}

export { Touchable as touchable };
