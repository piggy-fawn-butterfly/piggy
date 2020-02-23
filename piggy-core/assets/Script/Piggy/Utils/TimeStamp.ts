/**
 * @file TimeStamp
 * @description 日期格式化
 * @author DoooReyn <jl88744653@gmail.com>
 * @see 引用 [time-stamp](https://github.com/jonschlinkert/time-stamp)
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
class timestamp {
  private constructor() {}
  private static s_date_regex = /(?=(YYYY|YY|MM|DD|HH|mm|ss|ms))\1([:\/]*)/g;
  private static s_time_span = {
    YYYY: ["getFullYear", 4],
    YY: ["getFullYear", 2],
    MM: ["getMonth", 2, 1],
    DD: ["getDate", 2],
    HH: ["getHours", 2],
    mm: ["getMinutes", 2],
    ss: ["getSeconds", 2],
    ms: ["getMilliseconds", 3]
  };

  /**
   * 日期格式化
   * @param str 日期格式
   * @param date 日期
   * @param utc 使用 utc 模式
   */
  public static format(
    str: string = "YYYY-MM-DD",
    date: Date = new Date(),
    utc: boolean = false
  ): string {
    return str.replace(timestamp.s_date_regex, function(match, key, rest) {
      let args = timestamp.s_time_span[key];
      let name = args[0];
      let chars = args[1];
      if (utc === true) name = "getUTC" + name.slice(3);
      let val = "00" + String(date[name]() + (args[2] || 0));
      return val.slice(-chars) + (rest || "");
    });
  }
}

export { timestamp };
