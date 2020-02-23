import { strings } from "./Strings";
import { i18n, i18ns } from "../Core/i18n";
import { timestamp as _timestamp } from "./TimeStamp";

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
namespace datetime {
  export function timestamp(str?: string, date?: Date, utc?: boolean): string {
    return _timestamp.format(str, date, utc);
  }
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
  export interface I_Date_Time {
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
  export interface I_Date_Fmt {
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
  export function time2gt(time: number): I_Date_Time {
    let date: I_Date_Time = {
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
    fmt: I_Date_Fmt = {
      hour: true,
      day: true,
      month: false,
      year: false
    }
  ): string {
    let date: I_Date_Time = time2gt(time);
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
  export function time2dt(time: number): I_Date_Time {
    let date: I_Date_Time = {
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
    fmt: I_Date_Fmt = {
      hour: true,
      min: true,
      sec: true
    }
  ): string {
    let date: I_Date_Time = time2dt(time);
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
    let arr = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ].map(v => {
      return strings.prefixZero(v, 2);
    });
    let [h, m, s, ms] = arr;
    return `${h}:${m}:${s}.${ms}`;
  }

  /**
   * 日期模式
   */
  const DATE_PATTERNS = {
    ERA: "G", //Era 标志符 Era strings. For example: "AD" and "BC"
    YEAR: "y", //年
    MONTH: "M", //月份
    DAY_OF_MONTH: "d", //月份的天数
    HOUR_OF_DAY1: "k", //一天中的小时数（1-24）
    HOUR_OF_DAY0: "H", //24小时制，一天中的小时数（0-23）
    MINUTE: "m", //小时中的分钟数
    SECOND: "s", //秒
    MILLISECOND: "S", //毫秒
    DAY_OF_WEEK: "E", //一周中对应的星期，如星期一，周一
    DAY_OF_YEAR: "D", //一年中的第几天
    DAY_OF_WEEK_IN_MONTH: "F", //一月中的第几个星期(会把这个月总共过的天数除以7,不够准确，推荐用W)
    WEEK_OF_YEAR: "w", //一年中的第几个星期
    WEEK_OF_MONTH: "W", //一月中的第几星期(会根据实际情况来算)
    AM_PM: "a", //上下午标识
    HOUR1: "h", //12小时制 ，am/pm 中的小时数（1-12）
    HOUR0: "K", //和h类型
    ZONE_NAME: "z", //时区名
    ZONE_VALUE: "Z", //时区值
    WEEK_YEAR: "Y", //和y类型
    ISO_DAY_OF_WEEK: "u",
    ISO_ZONE: "X"
  };

  /**
   * 获取当前时间
   */
  export function getCurrentTime(): string {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let timeString =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return timeString;
  }

  /*
   * 比较时间大小
   * time1>time2 return 1
   * time1<time2 return -1
   * time1==time2 return 0
   */
  export function compareTime(
    time1: Date | string,
    time2: Date | string
  ): number {
    let d1 = time1;
    let d2 = time2;
    if (typeof d1 === "string") {
      d1 = new Date(Date.parse(d1.replace(/-/g, "/")));
    }
    if (typeof d2 === "string") {
      d2 = new Date(Date.parse(d2.replace(/-/g, "/")));
    }
    let t1 = d1.getTime();
    let t2 = d2.getTime();
    if (t1 === t2) {
      return 0;
    } else if (t1 > t2) {
      return 1;
    }
    return -1;
  }

  /**
   * 是否闰年
   */
  export function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * 获取某个月的天数，从0开始
   */
  export function getDaysOfMonth(year: number, month: number) {
    return [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ][month];
  }

  /**
   * 距离现在几天的日期：负数表示今天之前的日期，0表示今天，整数表示未来的日期
   * 如-1表示昨天的日期，0表示今天，2表示后天
   */
  export function fromToday(days: number) {
    let today = new Date();
    today.setDate(today.getDate() + days);
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    return date;
  }

  /**
   * 日期时间格式化
   * @param dateTime 需要格式化的日期时间
   * @param pattern  格式化的模式，如yyyy-MM-dd hh(HH):mm:ss.S a k K E D F w W z Z
   */
  export function format(dateTime: number | string | Date, pattern: string) {
    let date = new Date(dateTime);
    if (strings.isBlank(pattern)) {
      return date.toLocaleString();
    }
    return pattern.replace(/([a-z])\1*/gi, function(matchStr, group1) {
      let replacement = "";
      switch (group1) {
        case DATE_PATTERNS.ERA: //G
          break;
        case DATE_PATTERNS.WEEK_YEAR: //Y
        case DATE_PATTERNS.YEAR: //y
          replacement = date.getFullYear().toString();
          break;
        case DATE_PATTERNS.MONTH: //M
          let month = date.getMonth() + 1;
          replacement = (month < 10 && matchStr.length >= 2
            ? "0" + month
            : month
          ).toString();
          break;
        case DATE_PATTERNS.DAY_OF_MONTH: //d
          let _days = date.getDate();
          replacement = (_days < 10 && matchStr.length >= 2
            ? "0" + _days
            : _days
          ).toString();
          break;
        case DATE_PATTERNS.HOUR_OF_DAY1: //k(1~24)
          replacement = date.getHours().toString();
          break;
        case DATE_PATTERNS.HOUR_OF_DAY0: //H(0~23)
          let _hours24 = date.getHours();
          replacement = (_hours24 < 10 && matchStr.length >= 2
            ? "0" + _hours24
            : _hours24
          ).toString();
          break;
        case DATE_PATTERNS.MINUTE: //m
          let minutes = date.getMinutes();
          replacement = (minutes < 10 && matchStr.length >= 2
            ? "0" + minutes
            : minutes
          ).toString();
          break;
        case DATE_PATTERNS.SECOND: //s
          let seconds = date.getSeconds();
          replacement = (seconds < 10 && matchStr.length >= 2
            ? "0" + seconds
            : seconds
          ).toString();
          break;
        case DATE_PATTERNS.MILLISECOND: //S
          replacement = date.getMilliseconds().toString();
          break;
        case DATE_PATTERNS.DAY_OF_WEEK: //E
          replacement = i18ns.text(i18n.TextKey["date_week_" + date.getDay()]);
          break;
        case DATE_PATTERNS.DAY_OF_YEAR: //D
          replacement = dayOfTheYear(date).toString();
          break;
        case DATE_PATTERNS.DAY_OF_WEEK_IN_MONTH: //F
          replacement = Math.floor(date.getDate() / 7).toString();
          break;
        case DATE_PATTERNS.WEEK_OF_YEAR: //w
          replacement = Math.ceil(date.getDate() / 7).toString();
          break;
        case DATE_PATTERNS.WEEK_OF_MONTH: //W
          replacement = Math.ceil(date.getDate() / 7).toString();
          break;
        case DATE_PATTERNS.AM_PM: //a
          replacement =
            date.getHours() < 12
              ? i18ns.text(i18n.TextKey.date_am)
              : i18ns.text(i18n.TextKey.date_pm);
          break;
        case DATE_PATTERNS.HOUR1: //h(1~12)
          let hours12 = date.getHours() % 12 || 12; //0转为12
          replacement = (hours12 < 10 && matchStr.length >= 2
            ? "0" + hours12
            : hours12
          ).toString();
          break;
        case DATE_PATTERNS.HOUR0: //K(0~11)
          replacement = (date.getHours() % 12).toString();
          break;
        case DATE_PATTERNS.ZONE_NAME: //z
          replacement = getZoneNameValue(date)["name"];
          break;
        case DATE_PATTERNS.ZONE_VALUE: //Z
          replacement = getZoneNameValue(date)["value"];
          break;
        case DATE_PATTERNS.ISO_DAY_OF_WEEK: //u
          break;
        default:
          break;
      }
      return replacement;
    });
  }

  /**
   * 计算一个日期是当年的第几天
   * @param date
   */
  export function dayOfTheYear(date: Date | string | number): number {
    let obj = new Date(date);
    let year = obj.getFullYear();
    let month = obj.getMonth(); //从0开始
    let days = obj.getDate();
    let daysArr = [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ];
    for (let i = 0; i < month; i++) {
      days += daysArr[i];
    }
    return days;
  }

  /**
   * 获得时区名和值
   */
  export function getZoneNameValue(dateObj: Date) {
    let date = new Date(dateObj);
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    let arr = date.toString().match(/([A-Z]+)([-+]\d+:?\d+)/);
    let obj = {
      name: arr[1],
      value: arr[2]
    };
    return obj;
  }
}

export { datetime };
