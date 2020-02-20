/**
 * @file EventCenter
 * @description 事件中心处理事件的创建、分发、注册监听和解除监听，是对 `cc.EventTarget` 的二次封装
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
class EventCenter {
  public static s_instance: EventCenter = new EventCenter();

  /**
   * 记录所有添加了监听的事件标识，方便一次性全部解除，防止意外
   */
  private events: Set<string> = null;

  /**
   * 事件对象
   */
  private target: cc.EventTarget = null;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.events = new Set();
    this.target = new cc.EventTarget();
  }

  /**
   * 包装一个自定义事件
   * @param type
   * @param data
   */
  wrap(type: string, data?: any): cc.Event.EventCustom {
    let event = new cc.Event.EventCustom(type, true);
    data !== null && event.setUserData(data);
    return event;
  }

  /**
   * 监听事件
   * @param type 事件标识
   * @param callback 事件回调
   * @param target 指定监听对象
   * @param useCapture 使用捕捉
   */
  on(type: string, callback: Function, target?: any, useCapture?: boolean) {
    this.events.add(type);
    this.target.on(type, callback, target, useCapture);
  }

  /**
   * 监听事件，一次性
   * @param type 事件标识
   * @param callback 事件回调
   * @param target 指定监听对象
   * @param useCapture 使用捕捉
   */
  once(type: string, callback: Function, target?: any, useCapture?: boolean) {
    this.events.add(type);
    this.target.on(type, callback, target, useCapture);
  }

  /**
   * 解除监听事件
   * @param type 事件标识
   * @param callback 事件回调
   * @param target 指定监听对象
   */
  off(type: string, callback: Function, target?: any) {
    this.target.off(type, callback, target);
  }

  /**
   * 解除指定对象上的监听事件
   * @param target 指定监听对象
   */
  targetOff(target: any) {
    this.target.targetOff(target);
  }

  /**
   * 是否包含指定事件
   * @param type 事件标识
   */
  hasEventListener(type: string): boolean {
    return this.target.hasEventListener(type);
  }

  /**
   * 事件触发
   * @param key 事件标识
   * @param arg1 参数1
   * @param arg2 参数2
   * @param arg3 参数3
   * @param arg4 参数4
   * @param arg5 参数5
   */
  emit(
    key: string,
    arg1?: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ): void {
    this.target.emit(key, arg1, arg2, arg3, arg4, arg5);
  }

  /**
   * 分发指定事件
   * @param event cc.Event 事件对象
   */
  dispatchEvent(event: cc.Event) {
    this.target.dispatchEvent(event);
  }

  /**
   * 分发自定义事件
   * @param type 事件标识
   * @param data 事件携带数据
   */
  dispatch(type: string, data?: any) {
    this.dispatchEvent(this.wrap(type, data));
  }

  /**
   * 重置事件中心
   */
  reset() {
    let all = Array.from(this.events);
    all.forEach(name => {
      this.target.removeAll(name);
    });
    this.events.clear();
  }
}

let event_center = EventCenter.s_instance;

export { event_center };
