import { enums } from "../data/enums";
import { colors } from "../data/colors";
import { piggy } from "../piggy";

/**
 * @format
 * @file Logger
 * @class
 * @description 日志分级系统 低于设定等级的日志不会被输出
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class logger {
  static s_call_methods = [ enums.E_Log_Method.Trace, enums.E_Log_Method.Info, enums.E_Log_Method.Warn, enums.E_Log_Method.Error ];

  /**
 * 需要展示调用链的方法
 */
  static s_call_chains = [ enums.E_Log_Level.Trace, enums.E_Log_Level.Warn, enums.E_Log_Level.Error ];

  /**
   * console一般方法对应的颜色
   */
  static s_method_colors = [ colors.Purple.Z200, colors.Green.A100, colors.Yellow.Z300, colors.Red.Z200 ];

  constructor() {
    // /** 默认日志等级 */
    this.setLevel( enums.E_Log_Level.Trace );
  }

  /**
   * 设置日志等级
   * @param {number} level
   */
  setLevel( level ) {
    this.m_log_level = level;
  }

  /**
   * 获得日志等级
   * @returns {number}
   */
  getLevel() {
    return this.m_log_level;
  }

  /**
   * 是否完全开放
   * @returns {boolean}
   */
  isFullOpen() {
    return this.m_log_level === enums.E_Log_Level.Trace;
  }

  /**
   * 是否全部关闭
   * @returns {boolean}
   */
  isSilence() {
    return this.m_log_level === enums.E_Log_Level.Silence;
  }

  /**
   * 根据日志等级判定是否可用
   * @param {number} level 日志等级
   * @returns {boolean}
   */
  _isValid( level ) {
    return !this.isSilence() && level >= this.m_log_level;
  }

  /**
   * 输出日志内容
   * @description 移动端浏览器控制台不支持CSS
   * @param {number} level 日志等级
   * @param {string} label 分组标签
   * @param {any[]} groups 分组数据
   */
  _applyGroup( level, label, ...groups ) {
    if ( !this._isValid( level ) ) return;

    let method = logger.s_call_methods[ level ];
    let color = logger.s_method_colors[ level ];
    let unfold = label.indexOf( "@" ) === 0;
    label = unfold ? label.slice( 1 ) : label;
    let args = [];
    if ( cc.sys.isBrowser ) {
      args.push(
        `%c${ label } %c${ piggy.datetime.shortDay() }`,
        `font-weight:bold;background:${ color };`,
        `font-weight:bold;background:${ piggy.colors.Yellow.Z200 };`
      );
    } else {
      args.push( `${ label } ${ piggy.datetime.shortDay() }` );
    }
    if ( groups.length > 0 ) {
      unfold ? console.group( ...args ) : console.groupCollapsed( ...args );
      groups.forEach( e => console.log( e ) );
      logger.s_call_chains.includes( level ) && console[ method ]( "chains" );
      console.groupEnd();
    } else {
      console[ method ]( ...args );
    }
  }

  /**
   * 打印跟踪日志
   * @param {string} label
   * @param {any[]} args
   */
  trace( label, ...args ) {
    this._isValid( enums.E_Log_Level.Trace ) && this._applyGroup( enums.E_Log_Level.Trace, label, ...args );
  }

  /**
   * 打印信息日志
   * @param {string} label
   * @param {any[]} args
   */
  info( label, ...args ) {
    this._isValid( enums.E_Log_Level.Info ) && this._applyGroup( enums.E_Log_Level.Info, label, ...args );
  }

  /**
   * 打印警告日志
   * @param {string} label
   * @param {any[]} args
   */
  warn( label, ...args ) {
    this._isValid( enums.E_Log_Level.Warn ) && this._applyGroup( enums.E_Log_Level.Warn, label, ...args );
  }

  /**
   * 打印错误日志
   * @param {string} label
   * @param {any[]} args
   */
  error( label, ...args ) {
    this._isValid( enums.E_Log_Level.Error ) && this._applyGroup( enums.E_Log_Level.Error, label, ...args );
  }
}
