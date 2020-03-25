/**
 * @file datetime
 * @description 日期扩展库
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export const datetime = {
  /**
   * 日期格式化
   * @param {string} str 日期格式
   * @param {Date} date 日期
   * @param {boolean} utc 使用 utc 模式
   */
  timestamp(str = "YYYY-MM-DD", date = new Date(), utc = false) {
    return str.replace(piggy.constants.TIMESTAMP_PATTERN, (_, key, rest) => {
      let args = piggy.constants.TIMESTAMP_GROUPS[key];
      let name = args[0];
      let chars = args[1];
      if (utc === true) name = "getUTC" + name.slice(3);
      let val = "00" + String(date[name]() + (args[2] || 0));
      return val.slice(-chars) + (rest || "");
    });
  },

  /**
   * 获得本地格式化时间
   */
  getLocaleDateTime() {
    return new Date(Date.now()).toLocaleString();
  },

  /**
   * 将时间数值转为游戏日期
   * @param time 时间数值
   * @returns IDate
   */
  time2gt(time) {
    let date = { year: 0, month: 0, day: 0, hour: 0 };
    const { YEAR, MON, DAY, HOUR } = piggy.constants.GAME_DATE;
    date.year = Math.floor(time / YEAR) > 0 && (time -= date.year * YEAR);
    (date.month = Math.floor(time / MON)) > 0 && (time -= date.month * MON);
    (date.day = Math.floor(time / DAY)) > 0 && (time -= date.day * DAY);
    (date.hour = Math.floor(time / HOUR)) > 0 && (time -= date.hour * HOUR);
    return date;
  },

  /**
   * 将时间数值格式化为游戏日期
   * @param time 时间数值
   * @param fmt 格式化参数
   */
  format2gt(time, fmt = { hour: true, day: true, month: false, year: false }) {
    let date = time2gt(time);
    let str = "";
    fmt.year && date.year > 0 && (str += `${date.year}年`);
    fmt.month && date.month > 0 && (str += `${date.month}月`);
    fmt.day && date.day > 0 && (str += `${date.day}天`);
    fmt.hour && date.hour > 0 && (str += `${date.hour}时`);
    return str;
  },

  /**
   * 将时间数值转为普通日期
   * @param time 时间数值
   */
  time2dt(time) {
    let date = { year: 0, month: 0, day: 0, hour: 0, min: 0, sec: 0 };
    const { YEAR, MON, DAY, HOUR, MIN } = piggy.constants.DATE;
    date.year = Math.floor(time / YEAR) > 0 && (time -= date.year * YEAR);
    (date.month = Math.floor(time / MON)) > 0 && (time -= date.month * MON);
    (date.day = Math.floor(time / DAY)) > 0 && (time -= date.day * DAY);
    (date.hour = Math.floor(time / HOUR)) > 0 && (time -= date.hour * HOUR);
    (date.min = Math.floor(time / MIN)) > 0 && (time -= date.min * MIN);
    date.sec = time;
    return date;
  },

  /**
   * 将时间数值格式化为普通日期
   * @param time 时间数值
   * @param fmt 格式化参数
   */
  format2dt(time, fmt = { hour: true, min: true, sec: true }) {
    let date = time2dt(time);
    let str = "";
    fmt.year && date.year > 0 && (str += `${date.year}年`);
    fmt.month && date.month > 0 && (str += `${date.month}月`);
    fmt.day && date.day > 0 && (str += `${date.day}天`);
    fmt.hour && date.hour > 0 && (str += `${date.hour}小时`);
    fmt.min && date.min > 0 && (str += `${date.min}分`);
    fmt.sec && date.sec > 0 && (str += `${date.sec}秒`);
    return str;
  },

  /**
   * 短时间格式
   */
  shortDay() {
    let date = new Date();
    let arr = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()].map(v => {
      return piggy.strings.prefixZero(v, 2);
    });
    let [h, m, s, ms] = arr;
    return `${h}:${m}:${s}.${ms}`;
  },

  /**
   * 获取当前时间
   */
  getCurrentTime() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  /*
   * 比较时间大小
   * time1>time2 return 1
   * time1<time2 return -1
   * time1==time2 return 0
   */
  compareTime(time1, time2) {
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
  },

  /**
   * 是否闰年
   */
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  /**
   * 获取某个月的天数，从0开始
   */
  getDaysOfMonth(year, month) {
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  },

  /**
   * 距离现在几天的日期：负数表示今天之前的日期，0表示今天，整数表示未来的日期
   * 如-1表示昨天的日期，0表示今天，2表示后天
   */
  fromToday(days) {
    let today = new Date();
    today.setDate(today.getDate() + days);
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  },

  /**
   * 日期时间格式化
   * @param dateTime 需要格式化的日期时间
   * @param pattern  格式化的模式，如yyyy-MM-dd hh(HH):mm:ss.S a k K E D F w W z Z
   */
  format(dateTime) {
    let date = new Date(dateTime);
    if (piggy.strings.isBlank(pattern)) return date.toLocaleString();
    return pattern.replace(/([a-z])\1*/gi, function(matchStr, group) {
      let replacement = "";
      switch (group) {
        case piggy.constants.DATE_PATTERNS.ERA: //G
          break;
        case piggy.constants.DATE_PATTERNS.WEEK_YEAR: //Y
        case piggy.constants.DATE_PATTERNS.YEAR: //y
          replacement = date.getFullYear().toString();
          break;
        case piggy.constants.DATE_PATTERNS.MONTH: //M
          let month = date.getMonth() + 1;
          replacement = (month < 10 && matchStr.length >= 2 ? "0" + month : month).toString();
          break;
        case piggy.constants.DATE_PATTERNS.DAY_OF_MONTH: //d
          let _days = date.getDate();
          replacement = (_days < 10 && matchStr.length >= 2 ? "0" + _days : _days).toString();
          break;
        case piggy.constants.DATE_PATTERNS.HOUR_OF_DAY1: //k(1~24)
          replacement = date.getHours().toString();
          break;
        case piggy.constants.DATE_PATTERNS.HOUR_OF_DAY0: //H(0~23)
          let _hours24 = date.getHours();
          replacement = (_hours24 < 10 && matchStr.length >= 2 ? "0" + _hours24 : _hours24).toString();
          break;
        case piggy.constants.DATE_PATTERNS.MINUTE: //m
          let minutes = date.getMinutes();
          replacement = (minutes < 10 && matchStr.length >= 2 ? "0" + minutes : minutes).toString();
          break;
        case piggy.constants.DATE_PATTERNS.SECOND: //s
          let seconds = date.getSeconds();
          replacement = (seconds < 10 && matchStr.length >= 2 ? "0" + seconds : seconds).toString();
          break;
        case piggy.constants.DATE_PATTERNS.MILLISECOND: //S
          replacement = date.getMilliseconds().toString();
          break;
        case piggy.constants.DATE_PATTERNS.DAY_OF_WEEK: //E
          replacement = piggy.i18n.t(piggy.i18nK["date_week_" + date.getDay()]);
          break;
        case piggy.constants.DATE_PATTERNS.DAY_OF_YEAR: //D
          replacement = this.dayOfTheYear(date).toString();
          break;
        case piggy.constants.DATE_PATTERNS.DAY_OF_WEEK_IN_MONTH: //F
          replacement = Math.floor(date.getDate() / 7).toString();
          break;
        case piggy.constants.DATE_PATTERNS.WEEK_OF_YEAR: //w
          replacement = Math.ceil(date.getDate() / 7).toString();
          break;
        case piggy.constants.DATE_PATTERNS.WEEK_OF_MONTH: //W
          replacement = Math.ceil(date.getDate() / 7).toString();
          break;
        case piggy.constants.DATE_PATTERNS.AM_PM: //a
          replacement = date.getHours() < 12 ? piggy.i18n.t(piggy.i18nK.date_am) : piggy.i18n.t(piggy.i18nK.date_pm);
          break;
        case piggy.constants.DATE_PATTERNS.HOUR1: //h(1~12)
          let hours12 = date.getHours() % 12 || 12; //0转为12
          replacement = (hours12 < 10 && matchStr.length >= 2 ? "0" + hours12 : hours12).toString();
          break;
        case piggy.constants.DATE_PATTERNS.HOUR0: //K(0~11)
          replacement = (date.getHours() % 12).toString();
          break;
        case piggy.constants.DATE_PATTERNS.ZONE_NAME: //z
          replacement = this.getZoneNameValue(date)["name"];
          break;
        case piggy.constants.DATE_PATTERNS.ZONE_VALUE: //Z
          replacement = this.getZoneNameValue(date)["value"];
          break;
        case piggy.constants.DATE_PATTERNS.ISO_DAY_OF_WEEK: //u
          break;
        default:
          break;
      }
      return replacement;
    });
  },

  /**
   * 计算一个日期是当年的第几天
   * @param date
   */
  dayOfTheYear(date) {
    let obj = new Date(date);
    let year = obj.getFullYear();
    let month = obj.getMonth(); //从0开始
    let days = obj.getDate();
    for (let i = 0; i < month; i++) {
      days += this.getDaysOfMonth(year, i);
    }
    return days;
  },

  /**
   * 获得时区名和值
   */
  getZoneNameValue(dateObj) {
    let date = new Date(dateObj);
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    let arr = date.toString().match(/([A-Z]+)([-+]\d+:?\d+)/);
    let obj = {
      name: arr[1],
      value: arr[2]
    };
    return obj;
  },

  /**
   * 阻塞等待
   * @param {number} time 等待时间(s)
   */
  sleep(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time * 1000);
    });
  }
};
