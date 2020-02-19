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
