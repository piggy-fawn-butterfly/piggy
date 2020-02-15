/**
 * @file DateTime
 * @description 日期、时间扩展
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
 * 日期常数
 * @namespace
 */
export namespace DATE {
  /** 1年 */
  export const YEAR: number = 31104000;
  /** 1个月 */
  export const MON: number = 2592000;
  /** 1天 */
  export const DAY: number = 86400;
  /** 1小时 */
  export const HOUR: number = 3600;
  /** 1分钟 */
  export const MIN: number = 60;
  /** 1秒钟 */
  export const SEC: number = 1;
}

/**
 * 游戏日期常数
 * @namespace
 * @description 只显示天数和小时，表示现实时间与游戏时间的转换关系
 */
export namespace GAME_DATE {
  /** 1小时的时间 */
  export const HOUR: number = 30;
  /** 白天开始的时间 */
  export const DAY_FROM: number = HOUR * 6;
  /** 夜晚开始的时间 */
  export const NIGHT_FROM: number = HOUR * 18;
  /** 半天的时间 */
  export const HALF_DAY: number = HOUR * 12;
  /** 1天的时间 */
  export const DAY: number = HALF_DAY * 2;
  /** 1个月的时间 */
  export const MON: number = DAY * 30;
  /** 1个季度的时间 */
  export const SEASON: number = MON * 3;
  /** 1年的时间 */
  export const YEAR: number = SEASON * 4;
}

/**
 * 获得本地格式化时间
 */
export function getLocaleDateTime(): string {
  return new Date(Date.now()).toLocaleString();
}
/**
 * 日期格式
 * @interface
 */
export interface IDate {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  min?: number;
  sec?: number;
}

/**
 * 格式化日期参数
 * @interface
 */
export interface IDateFmt {
  year?: boolean;
  month?: boolean;
  day?: boolean;
  hour?: boolean;
  min?: boolean;
  sec?: boolean;
}

/**
 * 将时间数值转为游戏日期
 * @param time 时间数值
 * @returns IDate
 */
export function time2gt(time: number): IDate {
  let date: IDate = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0
  };
  const { YEAR, MON, DAY, HOUR } = GAME_DATE;
  date.year = Math.floor(time / YEAR) > 0 && (time -= date.year * YEAR);
  (date.month = Math.floor(time / MON)) > 0 && (time -= date.month * MON);
  (date.day = Math.floor(time / DAY)) > 0 && (time -= date.day * DAY);
  (date.hour = Math.floor(time / HOUR)) > 0 && (time -= date.hour * HOUR);
  return date;
}

/**
 * 将时间数值格式化为游戏日期
 * @param time 时间数值
 * @param fmt 格式化参数
 */
export function format2gt(
  time: number,
  fmt: IDateFmt = {
    hour: true,
    day: true,
    month: false,
    year: false
  }
): string {
  let date: IDate = time2gt(time);
  let str: string = "";
  fmt.year && date.year > 0 && (str += `${date.year}年`);
  fmt.month && date.month > 0 && (str += `${date.month}月`);
  fmt.day && date.day > 0 && (str += `${date.day}天`);
  fmt.hour && date.hour > 0 && (str += `${date.hour}时`);
  return str;
}

/**
 * 将时间数值转为普通日期
 * @param time 时间数值
 */
export function time2dt(time: number): IDate {
  let date: IDate = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    min: 0,
    sec: 0
  };
  const { YEAR, MON, DAY, HOUR, MIN } = DATE;
  date.year = Math.floor(time / YEAR) > 0 && (time -= date.year * YEAR);
  (date.month = Math.floor(time / MON)) > 0 && (time -= date.month * MON);
  (date.day = Math.floor(time / DAY)) > 0 && (time -= date.day * DAY);
  (date.hour = Math.floor(time / HOUR)) > 0 && (time -= date.hour * HOUR);
  (date.min = Math.floor(time / MIN)) > 0 && (time -= date.min * MIN);
  date.sec = time;
  return date;
}

/**
 * 将时间数值格式化为普通日期
 * @param time 时间数值
 * @param fmt 格式化参数
 */
export function format2dt(
  time: number,
  fmt: IDateFmt = {
    hour: true,
    min: true,
    sec: true
  }
): string {
  let date: IDate = time2dt(time);
  let str: string = "";
  fmt.year && date.year > 0 && (str += `${date.year}年`);
  fmt.month && date.month > 0 && (str += `${date.month}月`);
  fmt.day && date.day > 0 && (str += `${date.day}天`);
  fmt.hour && date.hour > 0 && (str += `${date.hour}小时`);
  fmt.min && date.min > 0 && (str += `${date.min}分`);
  fmt.sec && date.sec > 0 && (str += `${date.sec}秒`);
  return str;
}

/**
 * 短时间格式
 */
export function shortDay(): string {
  let date: Date = new Date();
  let h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ms = date.getMilliseconds();
  return `${h}:${m}:${s}.${ms}`;
}
