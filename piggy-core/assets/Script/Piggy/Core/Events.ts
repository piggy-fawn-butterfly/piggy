/**
 * @file Events
 * @description 事件管理器
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
class Events {
  public static s_instance: Events = new Events();
  private m_events: Set<string>;
  private m_target: cc.EventTarget = null;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.m_events = new Set();
    this.m_target = new cc.EventTarget();
  }

  /**
   * 创建新的事件
   * @param type 事件类型
   * @param data 事件携带数据
   */
  create(type: string, data?: any): cc.Event.EventCustom {
    let event = new cc.Event.EventCustom(type, true);
    data !== null && event.setUserData(data);
    return event;
  }

  /**
   * 监听事件
   * @param type 事件标识
   * @param callback 事件回调
   * @param target 事件目标
   * @param useCapture 使用捕捉
   */
  on(type: string, callback: Function, target?: object, useCapture?: boolean) {
    this.m_events.add(type);
    this.m_target.on(type, callback, target, useCapture);
  }

  /**
   * 一次性监听事件
   * @param type 事件标识
   * @param callback 事件回调
   * @param target 事件目标
   */
  once(
    type: string,
    callback: (event: cc.Event.EventCustom) => void,
    target?: object
  ) {
    this.m_events.add(type);
    this.m_target.once(type, callback, target);
  }

  /**
   * 解除监听事件
   * @param type 事件标识
   * @param callback 事件回调
   * @param target 事件目标
   */
  off(type: string, callback: Function, target?: object) {
    this.m_target.off(type, callback, target);
  }

  /**
   * 解除事件目标上的所有事件监听
   * @param target 事件目标
   */
  targetOff(target: object) {
    this.m_target.targetOff(target);
  }

  /**
   * 是否有监听事件
   * @param type 事件标识
   */
  hasEventListener(type: string): boolean {
    return this.m_target.hasEventListener(type);
  }

  /**
   * 触发事件
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
    this.m_target.emit(key, arg1, arg2, arg3, arg4, arg5);
  }

  /**
   * 分发事件
   * @param event 自定义事件
   */
  dispatchEvent(event: cc.Event) {
    this.m_target.dispatchEvent(event);
  }

  /**
   * 分发事件
   * @param type 事件标识
   * @param data 事件数据
   */
  dispatch(type: string, data?: any) {
    this.dispatchEvent(this.create(type, data));
  }

  /**
   * 重置事件管理器，删除所有事件
   */
  reset() {
    let all = Array.from(this.m_events);
    all.forEach(name => {
      this.m_target.removeAll(name);
    });
    this.m_events.clear();
  }
}

export const events = Events.s_instance;
