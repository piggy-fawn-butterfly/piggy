/**
 * @file logger
 * @description 日志分级系统，低于设定等级的日志不会被输出
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class logger {
  constructor() {
    this.s_call_methods = [piggy.enums.E_Log_Method.Trace, piggy.enums.E_Log_Method.Info, piggy.enums.E_Log_Method.Warn, piggy.enums.E_Log_Method.Error];
    this.s_call_chains = [piggy.enums.E_Log_Level.Trace, piggy.enums.E_Log_Level.Warn, piggy.enums.E_Log_Level.Error];
    this.s_method_colors = [piggy.colors.Purple.Z200, piggy.colors.Green.A100, piggy.colors.Yellow.Z300, piggy.colors.Red.Z200];
    /** 默认日志等级 */
    this.setLevel(piggy.enums.E_Log_Level.Trace);
  }

  /**
   * 设置日志等级
   * @param {piggy.enums.E_Log_Level} level
   */
  setLevel(level) {
    this.m_log_level = level;
  }

  /**
   * 获得日志等级
   * @returns {piggy.enums.E_Log_Level}
   */
  getLevel() {
    return this.m_log_level;
  }

  /**
   * 是否完全开放
   * @returns {boolean}
   */
  isFullOpen() {
    return this.m_log_level === piggy.enums.E_Log_Level.Trace;
  }

  /**
   * 是否全部关闭
   * @returns {boolean}
   */
  isSilence() {
    return this.m_log_level === piggy.enums.E_Log_Level.Silence;
  }

  /**
   * 根据日志等级判定是否可用
   * @param {number} level 日志等级
   * @returns {boolean}
   */
  _isValid(level) {
    return !this.isSilence() && level >= this.m_log_level;
  }

  /**
   * 输出日志内容
   * @description 移动端浏览器控制台不支持CSS
   * @param {number} level 日志等级
   * @param {string} label 分组标签
   * @param {...*} groups 分组数据
   */
  _applyGroup(level, label, ...groups) {
    if (!this._isValid(level)) return;

    let method = this.s_call_methods[level];
    let color = this.s_method_colors[level];
    let unfold = label.indexOf("@") === 0;
    label = unfold ? label.slice(1) : label;
    let args = [];
    if (cc.sys.isBrowser) {
      args.push(
        `%c${label} %c${piggy.datetime.shortDay()}`,
        `font-weight:bold;background:${color};`,
        `font-weight:bold;background:${piggy.colors.Yellow.Z200};`
      );
    } else {
      args.push(`${label} ${piggy.datetime.shortDay()}`);
    }
    if (groups.length > 0) {
      unfold ? console.group(args.pop(), ...args) : console.groupCollapsed(args.pop(), ...args);
      groups.forEach(e => console.log(e));
      this.s_call_chains.includes(level) && console[method]("chains");
      console.groupEnd();
    } else {
      console[method](...args);
    }
  }

  /**
   * 打印跟踪日志
   * @param {string} label
   * @param {...*} args
   */
  trace(label, ...args) {
    this._isValid(piggy.enums.E_Log_Level.Trace) && this._applyGroup(piggy.enums.E_Log_Level.Trace, label, ...args);
  }

  /**
   * 打印信息日志
   * @param {string} label
   * @param {...*} args
   */
  info(label, ...args) {
    this._isValid(piggy.enums.E_Log_Level.Info) && this._applyGroup(piggy.enums.E_Log_Level.Info, label, ...args);
  }

  /**
   * 打印警告日志
   * @param {string} label
   * @param {...*} args
   */
  warn(label, ...args) {
    this._isValid(piggy.enums.E_Log_Level.Warn) && this._applyGroup(piggy.enums.E_Log_Level.Warn, label, ...args);
  }

  /**
   * 打印错误日志
   * @param {string} label
   * @param {...*} args
   */
  error(label, ...args) {
    this._isValid(piggy.enums.E_Log_Level.Error) && this._applyGroup(piggy.enums.E_Log_Level.Error, label, ...args);
  }
}
