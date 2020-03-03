/**
 * @file Enums
 * @description 公共枚举声明文件
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
namespace enums {
  /**
   * 国际化选项
   * - CN: 简体中文
   * - TC: 繁体中文
   * - EN: 英文
   * - JP: 日文
   * - KR: 韩文
   * - FR: 法文
   */
  export enum E_Language_Choice {
    CN = 0, //简体中文
    TC, //繁体中文
    EN, //英文
    JP, //日文
    KR, //韩文
    FR //法文
  }

  /**
   * 版本选项
   * - Dev: 开发
   * - Beta: 测试
   * - Release: 发布
   */
  export enum E_Version_Choice {
    Dev = 0,
    Beta,
    Release
  }

  /**
   * 日志等级枚举
   */
  export enum E_Log_Level {
    Trace = 0,
    Info,
    Warn,
    Error,
    Silence
  }

  /**
   * 日志方法
   */
  export enum E_Log_Method {
    Trace = "trace",
    Info = "log",
    Warn = "warn",
    Error = "error"
  }

  /**
   * 音频类型
   */
  export enum E_Sound_Type {
    Music = "music",
    Effect = "effect"
  }

  /**
   * 视图类型
   * @summary 枚举值代表基础层级
   * - 背景视图根据当前打开的视图会自动更新层级，可根据需求调整穿透
   * - 除背景视图外，全屏窗口一定位于最底层或次底层，禁止穿透，无关闭或返回
   * - 停靠视图根据停靠对象，其层级会加上停靠对象的层级，外部可穿透，内部不可穿透，可选关闭
   * - 模态窗口处于全屏窗口之上，禁止穿透，可设置区域外关闭，必定有关闭或返回
   * - 消息框处于模态视图之上，禁止穿透，可设置区域外关闭，必定有关闭或返回
   * - 加载视图处于消息框之上，禁止穿透，无关闭或返回
   * - 消息文本处于加载视图之上，可穿透，无关闭或返回
   * - 调试信息一定位于最高层，无关闭或返回
   * @enum
   */
  export enum E_Layer_Type {
    Background = 0,
    Screen = 1,
    Dock = 2,
    Modal = 200,
    MsgBox = 300,
    Loading = 400,
    MsgText = 500,
    Cheat = 998,
    Debug = 999
  }

  /**
   * 建筑类型枚举
   * @enum {string}
   */
  export enum E_Building_Type {
    /** 城堡 */
    castle = "castle",
    /** 修道院 */
    cloister = "cloister",
    /** 仓库 */
    depository = "depository",
    /** 农田 */
    field = "field",
    /** 民居 */
    house = "house",
    /** 图书馆 */
    library = "library",
    /** 伐木场 */
    logging = "logging",
    /** 市场 */
    market = "market",
    /** 矿场 */
    mine = "mine"
  }

  /**
   * 定时器状态
   */
  export enum E_Timer_State {
    "Ready" = "ready",
    "Running" = "running",
    "Paused" = "paused",
    "Stopped" = "stopped"
  }

  /**
   * 定时器导出API
   */
  export enum E_Timer_API {
    "isInterrupt" = "isInterrupt",
    "isRunning" = "isRunning",
    "isPaused" = "isPaused",
    "isStopped" = "isStopped",
    "interrupt" = "interrupt",
    "recover" = "recover",
    "pause" = "pause",
    "restart" = "restart",
    "stop" = "stop",
    "resume" = "resume"
  }
}

export { enums };
