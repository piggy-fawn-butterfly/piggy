import { timer } from "./Timer";
import { events } from "./Events";
import { timers } from "./Timers";
import { userdata } from "./Userdata";
import { constants } from "../Const/Constant";

/**
 * @file Tick
 * @description 游戏时间计时器
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

/**
 * 游戏时间计时器
 */
class Tick {
  public static s_instance: Tick = new Tick();
  private m_timer_id: string = null;
  private m_tick_count: number = 0;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.reset();
  }

  /**
   * 计时器回调
   */
  private _tick() {
    let timer = this._timer();
    if (!timer || !timer.isRunning()) return;
    let interval = constants.AUTO_SAVE_INTERVAL * constants.SEC_TO_MS;
    timer.elapse > 0 && timer.elapse % interval === 0 && this._autoSave();
    userdata.m_raw_schemas.time.game.val += 1;
  }

  /**
   * 自动保存
   */
  private _autoSave() {
    events.dispatch(constants.EVENT_NAME.ON_AUTO_SAVE_USER_DATA);
    userdata.save();
  }

  /**
   * 暂停事件
   */
  private _onPause() {
    if (!this.m_timer_id) return;
    ++this.m_tick_count;
    this._timer().pause();
  }

  /**
   * 恢复事件
   */
  private _onResume() {
    if (!this.m_timer_id) return;
    --this.m_tick_count <= 0 && this._timer().resume();
  }

  /**
   * 获取定时器实例
   */
  private _timer(): timer {
    return timers.get(this.m_timer_id);
  }

  /**
   * 开始计时
   */
  public start() {
    if (this.m_timer_id) return;
    let timer = timers.new(this._tick.bind(this), 1, constants.MAX_TIME);
    events.on(constants.EVENT_NAME.ON_PAUSE_GAME_TIMER, this._onPause, this);
    events.on(constants.EVENT_NAME.ON_RESUME_GAME_TIMER, this._onResume, this);
    this.m_timer_id = timer.m_category;
    timer.start();
  }

  /**
   * 中断计时
   */
  interrupt() {
    if (this.m_timer_id) return;
    this._timer().interrupt();
  }

  /**
   * 恢复计时
   */
  public recover() {
    if (this.m_timer_id) return;
    this._timer().recover();
  }

  /**
   * 重置计时
   */
  public reset() {
    this.m_tick_count = 0;
    events.off(constants.EVENT_NAME.ON_PAUSE_GAME_TIMER, this._onPause, this);
    events.off(constants.EVENT_NAME.ON_PAUSE_GAME_TIMER, this._onResume, this);
    this.m_timer_id && timers.del(this.m_timer_id);
    this.m_timer_id = null;
  }
}

export const tick = Tick.s_instance;
