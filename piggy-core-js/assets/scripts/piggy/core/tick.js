import {timer} from "./timer";

/**
 * @file tick
 * @description 游戏时间计时器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */

/**
 * 游戏时间计时器
 */
export class tick {

  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_tick_count = 0;
    this.m_timer_id = null;
  }

  /**
   * 计时器回调
   */
  _tick() {
    let timer = this._timer();
    if ( !timer || !timer.isRunning() ) return;
    let interval = piggy.constants.AUTO_SAVE_INTERVAL * piggy.constants.SEC_TO_MS;
    timer.elapse > 0 && timer.elapse % interval === 0 && this._autoSave();
    piggy.userdata.m_raw_schemas.time.game.val += 1;
  }

  /**
   * 自动保存
   */
  _autoSave() {
    piggy.events.dispatch( piggy.constants.EVENT_NAME.ON_AUTO_SAVE_USER_DATA );
    piggy.userdata.save();
  }

  /**
   * 暂停事件
   */
  _onPause() {
    if ( !this.m_timer_id ) return;
    ++this.m_tick_count;
    this._timer().pause();
  }

  /**
   * 恢复事件
   */
  _onResume() {
    if ( !this.m_timer_id ) return;
    --this.m_tick_count <= 0 && this._timer().resume();
  }

  /**
   * 获取定时器实例
   * @returns {timer}
   */
  _timer() {
    return piggy.timers.get( this.m_timer_id );
  }

  /**
   * 开始计时
   */
  start() {
    if ( this.m_timer_id ) return;
    let timer = piggy.timers.new( this._tick.bind( this ), 1, piggy.constants.MAX_TIME );
    piggy.events.on( piggy.constants.EVENT_NAME.ON_RESUME_GAME_TIMER, this._onResume, this );
    piggy.events.on( piggy.constants.EVENT_NAME.ON_PAUSE_GAME_TIMER, this._onPause, this );
    this.m_timer_id = timer.m_category;
    timer.start();
  }

  /**
   * 中断计时
   */
  interrupt() {
    if ( this.m_timer_id ) return;
    this._timer().interrupt();
  }

  /**
   * 恢复计时
   */
  recover() {
    if ( this.m_timer_id ) return;
    this._timer().recover();
  }

  /**
   * 重置计时
   */
  reset() {
    this.m_tick_count = 0;
    piggy.events.targetOff( this );
    this.m_timer_id && piggy.timers.del( this.m_timer_id );
    this.m_timer_id = null;
  }
}
