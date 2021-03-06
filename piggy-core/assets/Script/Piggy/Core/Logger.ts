import { datetime } from "../Utils/DateTime";
import { enums } from "../Const/Declare/Enums";
import { colors } from "../Const/Colors";

/**
 * @file Logger
 * @class
 * @description 日志分级系统
 * 低于设定等级的日志不会被输出
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
class Logger {
  /**
   * console一般方法
   */
  private static readonly s_call_methods = [
    enums.E_Log_Method.Trace,
    enums.E_Log_Method.Info,
    enums.E_Log_Method.Warn,
    enums.E_Log_Method.Error
  ];

  /**
   * 需要展示调用链的方法
   */
  private static readonly s_call_chains = [
    enums.E_Log_Level.Trace,
    enums.E_Log_Level.Warn,
    enums.E_Log_Level.Error
  ];

  /**
   * console一般方法对应的颜色
   */
  private static readonly s_method_colors = [
    colors.Purple.Z200,
    colors.Green.A100,
    colors.Yellow.Z300,
    colors.Red.Z200
  ];

  /** 当前日志等级 */
  private static s_log_level: enums.E_Log_Level = enums.E_Log_Level.Trace;

  /**
   * 隐藏构造器
   */
  private constructor() {}

  /**
   * 设置日志等级
   * @param level
   */
  public static setLevel(level: enums.E_Log_Level) {
    this.s_log_level = level;
  }

  /**
   * 获得日志等级
   * @returns LOG_LEVEL
   */
  public static getLevel(): enums.E_Log_Level {
    return this.s_log_level;
  }

  /**
   * 是否完全开放
   * @returns boolean
   */
  public static isFullOpen(): boolean {
    return this.s_log_level === enums.E_Log_Level.Trace;
  }

  /**
   * 是否全部关闭
   * @returns boolean
   */
  public static isSilence(): boolean {
    return this.s_log_level === enums.E_Log_Level.Silence;
  }

  /**
   * 根据日志等级判定是否可用
   * @param level 日志等级
   */
  private static isValid(level: enums.E_Log_Level): boolean {
    return !this.isSilence() && level >= this.s_log_level;
  }

  /**
   * 输出日志内容
   * @description 移动端浏览器控制台不支持CSS
   * @param level 日志等级
   * @param label 分组标签
   * @param groups 分组数据
   */
  private static applyGroup(
    level: enums.E_Log_Level,
    label: string,
    ...groups: any
  ) {
    if (!this.isValid(level)) return;

    let method = Logger.s_call_methods[level];
    let color = Logger.s_method_colors[level];
    let unfold = label.indexOf("@") === 0;
    label = unfold ? label.slice(1) : label;
    let args = [];
    if (cc.sys.isBrowser) {
      args.push(
        `%c${label} %c${datetime.shortDay()}`,
        `font-weight:bold;background:${color};`,
        `font-weight:bold;background:${colors.Yellow.Z200};`
      );
    } else {
      args.push(`${label} ${datetime.shortDay()}`);
    }
    if (groups.length > 0) {
      unfold ? console.group(...args) : console.groupCollapsed(...args);
      groups.forEach((e: any) => console.log(e));
      Logger.s_call_chains.includes(level) && console[method]("chains");
      console.groupEnd();
    } else {
      console[method](...args);
    }
  }

  /**
   * 打印跟踪日志
   * @param args
   */
  public static trace(label: string, ...args: any): void {
    this.isValid(enums.E_Log_Level.Trace) &&
      this.applyGroup(enums.E_Log_Level.Trace, label, ...args);
  }

  /**
   * 打印信息日志
   * @param args
   */
  public static info(label: string, ...args: any): void {
    this.isValid(enums.E_Log_Level.Info) &&
      this.applyGroup(enums.E_Log_Level.Info, label, ...args);
  }

  /**
   * 打印警告日志
   * @param args
   */
  public static warn(label: string, ...args: any): void {
    this.isValid(enums.E_Log_Level.Warn) &&
      this.applyGroup(enums.E_Log_Level.Warn, label, ...args);
  }

  /**
   * 打印错误日志
   * @param args
   */
  public static error(label: string, ...args: any): void {
    this.isValid(enums.E_Log_Level.Error) &&
      this.applyGroup(enums.E_Log_Level.Error, label, ...args);
  }
}

export { Logger as logger };
