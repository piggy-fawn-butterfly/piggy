/**
 * @file events
 * @description 事件管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class events {
  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_events = new Set();
    this.m_target = new cc.EventTarget();
  }

  /**
   * 创建新的事件
   * @param {string} type 事件类型
   * @param {any} data 事件携带数据
   */
  create(type, data) {
    let event = new cc.Event.EventCustom(type, true);
    data !== null && event.setUserData(data);
    return event;
  }

  /**
   * 监听事件
   * @param {string} type 事件标识
   * @param {Function} callback 事件回调
   * @param {object} target 事件目标
   * @param {boolean} useCapture 使用捕捉
   */
  on(type, callback, target, useCapture = false) {
    this.m_events.add(type);
    this.m_target.on(type, callback, target, useCapture);
  }

  /**
   * 一次性监听事件
   * @param {string} type 事件标识
   * @param {(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void} callback 事件回调
   * @param {object} target 事件目标
   */
  once(type, callback, target) {
    this.m_events.add(type);
    this.m_target.once(type, callback, target);
  }

  /**
   * 解除监听事件
   * @param {string} type 事件标识
   * @param {(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void} callback 事件回调
   * @param {object} target 事件目标
   */
  off(type, callback, target) {
    this.m_target.off(type, callback, target);
  }

  /**
   * 解除事件目标上的所有事件监听
   * @param {object} target 事件目标
   */
  targetOff(target) {
    this.m_target.targetOff(target);
  }

  /**
   * 是否有监听事件
   * @param {string} type 事件标识
   */
  hasEventListener(type) {
    return this.m_target.hasEventListener(type);
  }

  /**
   * 触发事件
   * @param {string} key 事件标识
   * @param {any} arg1 参数1
   * @param {any} arg2 参数2
   * @param {any} arg3 参数3
   * @param {any} arg4 参数4
   * @param {any} arg5 参数5
   */
  emit(key, arg1, arg2, arg3, arg4, arg5) {
    this.m_target.emit(key, arg1, arg2, arg3, arg4, arg5);
  }

  /**
   * 分发事件
   * @param {cc.Event} event 自定义事件
   */
  dispatchEvent(event) {
    this.m_target.dispatchEvent(event);
  }

  /**
   * 分发事件
   * @param {string} type 事件标识
   * @param {any} data 事件数据
   */
  dispatch(type, data) {
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
