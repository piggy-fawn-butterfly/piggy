import { ids } from "./IdGenerator";
import { constants } from "../Const/Constant";
import { enums } from "../Const/Declare/Enums";

/**
 * @file Timer
 * @description 基于本地时间的定时器
 * - 增加系统中断处理
 * - 使用`Timers`管理所有定时器
 * @see Timers
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
class Timer {
  //定时器标识
  public m_category: string;
  //已经计时
  private m_time_elapse: number;
  //心跳计时器
  private m_tick_counter: any;
  //记录开始时间
  private m_start_at: number;
  //毫秒后调用
  private m_call_after: number;
  //毫秒后暂停
  private m_stop_after: number;
  //计时间隔
  private m_call_interval: number;
  //计时回调
  private m_tick_callback: Function;
  //计时回调
  private m_stop_callback: Function;
  //运行状态
  private m_state: enums.E_Timer_State;
  //保留中断状态，用于恢复中断时处理（中断时需要暂停，不同于暂停）
  private m_interrupted: boolean;
  //记录中断时运行状态
  private m_interrupted_state: enums.E_Timer_State;

  /**
   * 定时器构造器
   * @summary 构造时使用秒为单位，实际会转换成毫秒
   * @param tick_callback 定时器回调
   * @param call_interval 定时器调用间隔
   * @param stop_after 停止时间:小于等于0表示不停止，需手动停止
   * @param call_after 延迟时间
   */
  constructor(
    tick_callback: Function,
    call_interval: number,
    stop_after: number,
    call_after?: number,
    stop_callback?: Function
  ) {
    const { MAX_TIME, SEC_TO_MS } = constants;
    this.m_category = ids.timer.next();
    this.m_tick_callback = tick_callback;
    this.m_call_interval = call_interval * SEC_TO_MS;
    this.m_stop_after = stop_after <= 0 ? MAX_TIME : stop_after * SEC_TO_MS;
    this.m_call_after = (call_after || 0) * SEC_TO_MS;
    this.m_stop_callback = stop_callback || function() {};
    this.m_interrupted = false;
    this._reset();
  }

  /**
   * 是否运行中
   */
  public isRunning(): boolean {
    return this.m_state === enums.E_Timer_State.Running;
  }

  /**
   * 是否已暂停
   */
  public isPaused(): boolean {
    return this.m_state === enums.E_Timer_State.Paused;
  }

  /**
   * 是否已结束
   */
  public isStopped(): boolean {
    return this.m_state === enums.E_Timer_State.Stopped;
  }

  /**
   * 是否被中断
   */
  public isInterrupted(): boolean {
    return this.m_interrupted;
  }

  /**
   * 中断
   */
  public interrupt(): void {
    this.m_interrupted = true;
    this.m_interrupted_state = this.m_state;
    this.pause();
  }

  /**
   * 恢复中断
   * 只有中断前还在运行的定时器会被恢复
   */
  public recover(): void {
    if (
      this.m_interrupted &&
      this.m_interrupted_state === enums.E_Timer_State.Running
    ) {
      this.m_interrupted = false;
      this.m_interrupted_state = null;
      this.resume();
    }
  }

  /**
   * 重启定时器
   */
  public restart() {
    this.stop();
    this._reset();
    this.start();
  }

  /**
   * 启动定时器
   */
  public start() {
    if (this.m_tick_counter !== null) return;
    let time_out_id = setTimeout(() => {
      clearTimeout(time_out_id);
      this.m_start_at = this._now();
      this.m_state = enums.E_Timer_State.Running;
      this.m_tick_counter = setInterval(() => {
        if (this.isRunning() && !this.isInterrupted()) {
          this.m_tick_callback(this);
          if (this.elapse >= this.m_stop_after) {
            this.stop();
            this.m_stop_callback(this);
          }
        }
      }, this.m_call_interval);
    }, this.m_call_after);
  }

  /**
   * 当前时间
   */
  private _now(): number {
    return Date.now().valueOf();
  }

  /**
   * 获得当前计时(ms)
   * @returns number 当前计时(ms)
   */
  public get elapse(): number {
    let elapse = 0;
    if (this.m_state === enums.E_Timer_State.Running) {
      elapse = this.m_time_elapse + this._now() - this.m_start_at;
    } else {
      elapse = this.m_time_elapse;
    }
    return Math.min(elapse, this.m_stop_after);
  }

  /**
   * 获得剩余计时(ms)
   * @returns number 剩余计时(ms)
   */
  public get rest(): number {
    return this.m_stop_after - this.elapse;
  }

  /**
   * 重置定时器
   */
  private _reset() {
    if (this.m_tick_counter !== null) clearInterval(this.m_tick_counter);
    this.m_state = enums.E_Timer_State.Ready;
    this.m_start_at = this._now();
    this.m_time_elapse = 0;
    this.m_tick_counter = null;
  }

  /**
   * 暂停定时器
   */
  public pause() {
    if (this.m_state === enums.E_Timer_State.Running) {
      this.m_time_elapse += this._now() - this.m_start_at;
      this.m_state = enums.E_Timer_State.Paused;
    }
  }

  /**
   * 恢复定时器
   */
  public resume() {
    if (this.m_state === enums.E_Timer_State.Paused) {
      this.m_start_at = this._now();
      this.m_state = enums.E_Timer_State.Running;
    }
  }

  /**
   * 停止计时器
   */
  public stop() {
    if (this.m_state !== enums.E_Timer_State.Stopped) {
      clearInterval(this.m_tick_counter);
      this.m_tick_counter = null;
      this.m_time_elapse += this._now() - this.m_start_at;
      this.m_time_elapse = Math.min(this.m_stop_after, this.m_time_elapse);
      this.m_start_at = this._now();
      this.m_state = enums.E_Timer_State.Stopped;
    }
  }

  /**
   * 获得定时器状态
   */
  public getState(): enums.E_Timer_State {
    return this.m_state;
  }
}

export { Timer as timer };
