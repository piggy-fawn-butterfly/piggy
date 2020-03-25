/**
 * @file timer
 * @description 基于本地时间的定时器
 * - 增加系统中断处理
 * - 使用`timers`管理所有定时器
 * @see timers
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class timer {
  /**
   * 定时器构造器
   * @description 默认间隔1秒，永不停止
   * @summary 构造时使用秒为单位，实际会转换成毫秒
   * @param {Function} tick_callback 定时器回调
   * @param {number} call_interval 定时器调用间隔
   * @param {number} stop_after 停止时间:小于等于0表示不停止，需手动停止
   * @param {number} call_after 延迟时间
   * @param {Function} stop_callback 定时器停止回调
   */
  constructor(
    tick_callback,
    call_interval = 1,
    stop_after = 0,
    call_after = 0,
    stop_callback = null
  ) {
    const { MAX_TIME, SEC_TO_MS } = piggy.constants;
    this.m_category = piggy.ids.timer.next();
    this.m_tick_callback = tick_callback;
    this.m_call_interval = call_interval * SEC_TO_MS;
    this.m_stop_after = stop_after <= 0 ? MAX_TIME : stop_after * SEC_TO_MS;
    this.m_call_after = ( call_after || 0 ) * SEC_TO_MS;
    this.m_stop_callback = stop_callback || function() { };
    this.m_interrupted = false;
    this._reset();
  }

  /**
   * 是否运行中
   * @returns {boolean}
   */
  isRunning() {
    return this.m_state === piggy.enums.E_Timer_State.Running;
  }

  /**
   * 是否已暂停
   * @returns {boolean}
   */
  isPaused() {
    return this.m_state === piggy.enums.E_Timer_State.Paused;
  }

  /**
   * 是否已结束
   * @returns {boolean}
   */
  isStopped() {
    return this.m_state === piggy.enums.E_Timer_State.Stopped;
  }

  /**
   * 是否被中断
   * @returns {boolean}
   */
  isInterrupted() {
    return this.m_interrupted;
  }

  /**
   * 中断
   */
  interrupt() {
    this.m_interrupted = true;
    this.m_interrupted_state = this.m_state;
    this.pause();
  }

  /**
   * 恢复中断
   * 只有中断前还在运行的定时器会被恢复
   */
  recover() {
    if (
      this.m_interrupted &&
      this.m_interrupted_state === piggy.enums.E_Timer_State.Running
    ) {
      this.m_interrupted = false;
      this.m_interrupted_state = null;
      this.resume();
    }
  }

  /**
   * 重启定时器
   */
  restart() {
    this.stop();
    this._reset();
    this.start();
  }

  /**
   * 启动定时器
   */
  start() {
    if ( this.m_tick_counter !== null ) return;
    let time_out_id = setTimeout( () => {
      clearTimeout( time_out_id );
      this.m_start_at = this._now();
      this.m_state = piggy.enums.E_Timer_State.Running;
      this.m_tick_counter = setInterval( () => {
        if ( this.isRunning() && !this.isInterrupted() ) {
          this.m_tick_callback( this );
          if ( this.elapse >= this.m_stop_after ) {
            this.stop();
            this.m_stop_callback( this );
          }
        }
      }, this.m_call_interval );
    }, this.m_call_after );
  }

  /**
   * 当前时间
   * @returns {number}
   */
  _now() {
    return Date.now().valueOf();
  }

  /**
   * 获得当前计时(ms)
   * @returns {number}
   */
  get elapse() {
    let elapse;
    if ( this.m_state === piggy.enums.E_Timer_State.Running ) {
      elapse = this.m_time_elapse + this._now() - this.m_start_at;
    } else {
      elapse = this.m_time_elapse;
    }
    return Math.min( elapse, this.m_stop_after );
  }
  
  /**
   * 获得剩余计时(ms)
   * @returns {number}
   */
  get rest() {
    return this.m_stop_after - this.elapse;
  }

  /**
   * 重置定时器
   */
  _reset() {
    if ( this.m_tick_counter !== null ) clearInterval( this.m_tick_counter );
    this.m_state = piggy.enums.E_Timer_State.Ready;
    this.m_start_at = this._now();
    this.m_time_elapse = 0;
    this.m_tick_counter = null;
  }

  /**
   * 暂停定时器
   */
  pause() {
    if ( this.m_state === piggy.enums.E_Timer_State.Running ) {
      this.m_time_elapse += this._now() - this.m_start_at;
      this.m_state = piggy.enums.E_Timer_State.Paused;
    }
  }

  /**
   * 恢复定时器
   */
  resume() {
    if ( this.m_state === piggy.enums.E_Timer_State.Paused ) {
      this.m_start_at = this._now();
      this.m_state = piggy.enums.E_Timer_State.Running;
    }
  }

  /**
   * 停止计时器
   */
  stop() {
    if ( this.m_state !== piggy.enums.E_Timer_State.Stopped ) {
      clearInterval( this.m_tick_counter );
      this.m_tick_counter = null;
      this.m_time_elapse += this._now() - this.m_start_at;
      this.m_time_elapse = Math.min( this.m_stop_after, this.m_time_elapse );
      this.m_start_at = this._now();
      this.m_state = piggy.enums.E_Timer_State.Stopped;
    }
  }

  /**
   * 获得定时器状态
   * @returns {string}
   */
  getState() {
    return this.m_state;
  }
}
