import { i18n } from "./i18n";
import { logger } from "./Logger";
import { timer as Timer } from "./Timer";
import { strings } from "../Utils/Strings";
import { enums } from "../Const/Declare/Enums";

/**
 * @file Timers
 * @description 定时器管理器
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
class Timers {
  public static s_instance: Timers = new Timers();
  private m_timers: Map<string, Timer> = null;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.m_timers = new Map();
  }

  /**
   * 执行定时器指令
   * @param command 定时器指令
   * @param timer_id 定时器标识
   */
  private _sendCommand(command: enums.E_Timer_API, timer_id?: string): any {
    if (!timer_id) {
      this.m_timers.forEach(timer => {
        timer[command]();
      });
      return;
    }
    if (this.m_timers.has(timer_id)) return this.get(timer_id)[command]();
  }

  /**
   * 定时器是否运行
   * @param timer_id 定时器标识
   */
  public isRunning(timer_id: string): boolean {
    return this._sendCommand(enums.E_Timer_API.isRunning, timer_id);
  }

  /**
   * 定时器是否暂停
   * @param timer_id 定时器标识
   */
  public isPaused(timer_id: string): boolean {
    return this._sendCommand(enums.E_Timer_API.isPaused, timer_id);
  }

  /**
   * 定时器是否中断
   * @param timer_id 定时器标识
   */
  public isInterrupt(timer_id: string): boolean {
    return this._sendCommand(enums.E_Timer_API.isInterrupt, timer_id);
  }

  /**
   * 定时器是否停止
   * @param timer_id 定时器标识
   */
  public isStopped(timer_id: string): boolean {
    return this._sendCommand(enums.E_Timer_API.isStopped, timer_id);
  }

  /**
   * 新建定时器
   * @summary 构造时使用秒为单位，实际会转换成毫秒
   * @param tick_callback 定时器回调
   * @param call_interval 定时器调用间隔
   * @param stop_after 停止时间
   * @param call_after 延迟时间
   */
  public new(
    tick_callback: Function,
    call_interval: number,
    stop_after: number,
    call_after?: number,
    stop_callback?: Function
  ): Timer {
    let timer = new Timer(
      tick_callback,
      call_interval,
      stop_after,
      call_after,
      stop_callback
    );
    this.m_timers.set(timer.m_category, timer);
    return timer;
  }

  /**
   * 获取已调度的定时器
   * @param timer_id 定时器标识
   */
  public get(timer_id: string): Timer {
    return this.m_timers.get(timer_id);
  }

  /**
   * 删除定时器
   * - 不指定标识，则删除全部定时器
   * @param timer_id 定时器标识
   */
  public del(timer_id?: string) {
    //删除指定定时器
    if (timer_id && this.m_timers.has(timer_id)) {
      this.m_timers.get(timer_id).stop();
      this.m_timers.delete(timer_id);
      return;
    }
    //删除全部定时器
    this.m_timers.forEach(timer => {
      timer.stop();
    });
    this.m_timers.clear();
  }

  /**
   * 中断定时器
   * @param timer_id 定时器标识
   */
  public interrupt(timer_id?: string) {
    this._sendCommand(enums.E_Timer_API.interrupt, timer_id);
  }

  /**
   * 恢复中断的定时器
   * @param timer_id 定时器标识
   */
  public recover(timer_id?: string) {
    this._sendCommand(enums.E_Timer_API.recover, timer_id);
  }

  /**
   * 暂停定时器
   * @param timer_id 定时器标识
   */
  public pause(timer_id?: string) {
    this._sendCommand(enums.E_Timer_API.pause, timer_id);
  }

  /**
   * 恢复定时器
   * @param timer_id 定时器标识
   */
  public resume(timer_id?: string) {
    this._sendCommand(enums.E_Timer_API.resume, timer_id);
  }

  /**
   * 停止定时器
   * @param timer_id 定时器标识
   */
  public stop(timer_id?: string) {
    this._sendCommand(enums.E_Timer_API.stop, timer_id);
  }

  /**
   * 输出信息
   */
  public dump() {
    let data = [];
    this.m_timers.forEach((timer: Timer) => {
      let context = {
        name: timer.m_category,
        state: timer.getState(),
        elapse: timer.elapse,
        rest: timer.rest
      };
      data.push(strings.render(i18n.I.text(i18n.K.timer_information), context));
    });
    logger.info(i18n.I.text(i18n.K.timer_all_information), ...data);
  }
}

export const timers = Timers.s_instance;
