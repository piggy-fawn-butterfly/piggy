import { piggy } from "../piggy";
import { timer } from "./timer";

/**
 * @file timers
 * @description 定时器管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class timers {
  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_timers = new Map();
  }

  /**
   * 执行定时器指令
   * @param {string} command 定时器指令
   * @param {string} timer_id 定时器标识
   * @returns {any}
   */
  _sendCommand( command, timer_id = null ) {
    if ( !timer_id ) {
      this.m_timers.forEach( timer => {
        timer[ command ]();
      } );
      return;
    }
    if ( this.m_timers.has( timer_id ) ) return this.get( timer_id )[ command ]();
  }

  /**
   * 定时器是否运行
   * @param {string} timer_id 定时器标识
   * @returns {boolean}
   */
  isRunning( timer_id ) {
    return this._sendCommand( piggy.enums.E_Timer_API.isRunning, timer_id );
  }

  /**
   * 定时器是否暂停
   * @param {string} timer_id 定时器标识
   * @returns {boolean}
   */
  isPaused( timer_id ) {
    return this._sendCommand( piggy.enums.E_Timer_API.isPaused, timer_id );
  }

  /**
   * 定时器是否中断
   * @param {string} timer_id 定时器标识
   * @returns {boolean}
   */
  isInterrupt( timer_id ) {
    return this._sendCommand( piggy.enums.E_Timer_API.isInterrupt, timer_id );
  }

  /**
   * 定时器是否停止
   * @param {string} timer_id 定时器标识
   * @returns {boolean}
   */
  isStopped( timer_id ) {
    return this._sendCommand( piggy.enums.E_Timer_API.isStopped, timer_id );
  }

  /**
   * 新建定时器
   * @summary 构造时使用秒为单位，实际会转换成毫秒
   * @param {Function} tick_callback 定时器回调
   * @param {number} call_interval 定时器调用间隔
   * @param {number} stop_after 停止时间:小于等于0表示不停止，需手动停止
   * @param {number} call_after 延迟时间
   * @param {Function} stop_callback 定时器停止回调
   */
  new(
    tick_callback,
    call_interval = 1,
    stop_after = 0,
    call_after = 0,
    stop_callback = null
  ) {
    let _timer = new timer(
      tick_callback,
      call_interval,
      stop_after,
      call_after,
      stop_callback
    );
    this.m_timers.set( _timer.m_category, _timer );
    return _timer;
  }

  /**
   * 获取已调度的定时器
   * @param {string} timer_id 定时器标识
   * @returns {timer}
   */
  get( timer_id ) {
    return this.m_timers.get( timer_id );
  }

  /**
   * 删除定时器
   * - 不指定标识，则删除全部定时器
   * @param {string} timer_id 定时器标识
   */
  del( timer_id = null ) {
    //删除指定定时器
    if ( timer_id && this.m_timers.has( timer_id ) ) {
      this.m_timers.get( timer_id ).stop();
      this.m_timers.delete( timer_id );
      return;
    }
    //删除全部定时器
    this.m_timers.forEach( timer => {
      timer.stop();
    } );
    this.m_timers.clear();
  }

  /**
   * 中断定时器
   * @param {string} timer_id 定时器标识
   */
  interrupt( timer_id = null ) {
    this._sendCommand( piggy.enums.E_Timer_API.interrupt, timer_id );
  }

  /**
   * 恢复中断的定时器
   * @param {string} timer_id 定时器标识
   */
  recover( timer_id = null ) {
    this._sendCommand( piggy.enums.E_Timer_API.recover, timer_id );
  }

  /**
   * 暂停定时器
   * @param {string} timer_id 定时器标识
   */
  pause( timer_id = null ) {
    this._sendCommand( piggy.enums.E_Timer_API.pause, timer_id );
  }

  /**
   * 恢复定时器
   * @param {string} timer_id 定时器标识
   */
  resume( timer_id = null ) {
    this._sendCommand( piggy.enums.E_Timer_API.resume, timer_id );
  }

  /**
   * 停止定时器
   * @param {string} timer_id 定时器标识
   */
  stop( timer_id = null ) {
    this._sendCommand( piggy.enums.E_Timer_API.stop, timer_id );
  }

  /**
   * 输出信息
   */
  dump() {
    let data = [];
    this.m_timers.forEach( ( timer ) => {
      let context = {
        name: timer.m_category,
        state: timer.getState(),
        elapse: timer.elapse,
        rest: timer.rest
      };
      data.push( piggy.strings.render( piggy.i18n.t( piggy.i18nK.timer_information ), context ) );
    } );
    piggy.logger.info( piggy.i18n.t( piggy.i18nK.timer_all_information ), ...data );
  }
}
