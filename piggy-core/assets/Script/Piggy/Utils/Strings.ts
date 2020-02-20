/**
 * @file Strings
 * @description 字符串扩展
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
namespace strings {
  /**
   * 字符串高位补零
   * @param str 原字符串
   * @param num 设定默认字符串长度，长度不够时进行高位补零
   * @returns 高位补零后的字符串
   */
  export function prefixZero(str: string | number, len: number = 1): string {
    let n = String(str).length;
    let t = Math.max(0, len - n);
    t > 0 && (str = "0".repeat(t) + str);
    return String(str);
  }

  /**
   * 获得字符串的CharCodes
   * @param str
   */
  export function getCharCodes(str: string, len: number = str.length - 1) {
    return str
      .split("")
      .slice(0, len)
      .map((v: string) => {
        return v.charCodeAt(0);
      })
      .join("");
  }

  /**
   * 检测字符串是否json字符串
   * @param raw 字符串
   */
  export function isJsonString(raw: string): boolean {
    try {
      let obj = JSON.parse(raw);
      if (!!obj && typeof obj === "object") {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  /**
   * 空字符串
   */
  export function isEmpty(input: string) {
    return input == null || input == "";
  }

  /**
   * 非空字符串
   */
  export function isNotEmpty(input: string) {
    return !this.isEmpty(input);
  }

  /**
   * 空白字符串
   */
  export function isBlank(input: string) {
    return input == null || /^\s*$/.test(input);
  }

  /**
   * 非空白字符串
   */
  export function isNotBlank(input: string) {
    return !this.isBlank(input);
  }

  /**
   * 删除两边空格
   */
  export function trim(input: string) {
    return input.replace(/^\s+|\s+$/, "");
  }

  /**
   * 删除两边空格
   */
  export function trimToEmpty(input: string) {
    return input == null ? "" : this.trim(input);
  }

  /**
   * 是否包含指定字符串
   */
  export function contains(input: string, searchSeq: string) {
    return input.indexOf(searchSeq) >= 0;
  }

  /**
   * 字符串比较相等
   */
  export function equals(input1: string, input2: string) {
    return input1 == input2;
  }

  /**
   * 字符串比较相等，忽略大小写
   */
  export function equalsIgnoreCase(input1: string, input2: string) {
    return input1.toLocaleLowerCase() == input2.toLocaleLowerCase();
  }

  /**
   * 是否包含空白字符
   */
  export function containsWhitespace(input: string) {
    return this.contains(input, " ");
  }

  /**
   * 生成指定个数的字符
   */
  export function repeat(ch: string, repeatTimes: number) {
    let result = "";
    for (let i = 0; i < repeatTimes; i++) {
      result += ch;
    }
    return result;
  }

  /**
   * 删除空白字符
   */
  export function deleteWhitespace(input: string) {
    return input.replace(/\s+/g, "");
  }

  /**
   * 向右补齐
   */
  export function rightPad(input: string, size: number, padStr: string) {
    return input + this.repeat(padStr, size);
  }

  /**
   * 向左补齐
   */
  export function leftPad(input: string, size: number, padStr: string) {
    return this.repeat(padStr, size) + input;
  }

  /**
   * 首小写字母转大写
   */
  export function capitalize(input: string) {
    if (input === null || input.length === 0) {
      return input;
    }
    return input.replace(/^[a-z]/, function(matchStr) {
      return matchStr.toLocaleUpperCase();
    });
  }

  /**
   * 首大写字母转小写
   */
  export function unCapitalize(input: string) {
    if (input === null || input.length === 0) {
      return input;
    }
    return input.replace(/^[A-Z]/, function(matchStr) {
      return matchStr.toLocaleLowerCase();
    });
  }

  /**
   * 大写转小写，小写转大写
   */
  export function swapCase(input: string) {
    return input.replace(/[a-z]/gi, function(matchStr) {
      if (matchStr >= "A" && matchStr <= "Z") {
        return matchStr.toLocaleLowerCase();
      } else if (matchStr >= "a" && matchStr <= "z") {
        return matchStr.toLocaleUpperCase();
      }
    });
  }

  /**
   * 统计含有的子字符串的个数
   */
  export function countMatches(input: string, sub: string) {
    if (this.isEmpty(input) || this.isEmpty(sub)) {
      return 0;
    }
    let count = 0;
    let index = 0;
    while ((index = input.indexOf(sub, index)) != -1) {
      index += sub.length;
      count++;
    }
    return count;
  }

  /**
   * 只包含字母
   */
  export function isAlpha(input: string) {
    return /^[a-z]+$/i.test(input);
  }

  /**
   * 只包含字母、空格
   */
  export function isAlphaSpace(input: string) {
    return /^[a-z\s]*$/i.test(input);
  }

  /**
   * 只包含字母、数字
   */
  export function isAlphanumeric(input: string) {
    return /^[a-z0-9]+$/i.test(input);
  }

  /**
   * 只包含字母、数字和空格
   */
  export function isAlphanumericSpace(input: string) {
    return /^[a-z0-9\s]*$/i.test(input);
  }
  /**
   * 数字
   */
  export function isNumeric(input: string) {
    return /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(input);
  }

  /**
   * 小数
   */
  export function isDecimal(input: string) {
    return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test(input);
  }

  /**
   * 负小数
   */
  export function isNegativeDecimal(input: string) {
    return /^\-(?:0|[1-9]\d*)\.\d+$/.test(input);
  }

  /**
   * 正小数
   */
  export function isPositiveDecimal(input: string) {
    return /^\+?(?:0|[1-9]\d*)\.\d+$/.test(input);
  }

  /**
   * 整数
   */
  export function isInteger(input: string) {
    return /^[-+]?(?:0|[1-9]\d*)$/.test(input);
  }

  /**
   * 正整数
   */
  export function isPositiveInteger(input: string) {
    return /^\+?(?:0|[1-9]\d*)$/.test(input);
  }

  /**
   * 负整数
   */
  export function isNegativeInteger(input: string) {
    return /^\-(?:0|[1-9]\d*)$/.test(input);
  }

  /**
   * 只包含数字和空格
   */
  export function isNumericSpace(input: string) {
    return /^[\d\s]*$/.test(input);
  }

  /**
   * 只包含空字符
   */
  export function isWhitespace(input: string) {
    return /^\s*$/.test(input);
  }

  /**
   * 全部小写字母
   * @param input
   */
  export function isAllLowerCase(input: string) {
    return /^[a-z]+$/.test(input);
  }

  /**
   * 全部大写字母
   */
  export function isAllUpperCase(input: string) {
    return /^[A-Z]+$/.test(input);
  }

  /**
   * 字符串反转
   */
  export function reverse(input: string) {
    if (this.isBlank(input)) {
      input;
    }
    return input
      .split("")
      .reverse()
      .join("");
  }

  /**
   * 删掉特殊字符(英文状态下)
   */
  export function removeSpecialCharacter(input: string) {
    return input.replace(/[!-/:-@\[-`{-~]/g, "");
  }

  /**
   * 只包含特殊字符、数字和字母（不包括空格，若想包括空格，改为[ -~]）
   */
  export function isSpecialCharacterAlphanumeric(input: string) {
    return /^[!-~]+$/.test(input);
  }

  /**
   * 消息格式化
   */
  export function format(message: string, arr: [string]) {
    return message.replace(/{(\d+)}/g, function(_, group) {
      return arr[group];
    });
  }

  /**
   * 把连续出现多次的字母字符串进行压缩。如输入:aaabbbbcccccd  输出:3a4b5cd
   * @param input
   * @param ignoreCase
   */
  export function compressRepeatedStr(input: string, ignoreCase: boolean) {
    let pattern = new RegExp("([a-z])\\1+", ignoreCase ? "ig" : "g");
    return input.replace(pattern, function(matchStr, group1) {
      return matchStr.length + group1;
    });
  }

  /**
   * 中文校验
   */
  export function isChinese(input: string) {
    return /^[\u4E00-\u9FA5]+$/.test(input);
  }

  /**
   * 去掉中文字符
   */
  export function removeChinese(input: string) {
    return input.replace(/[\u4E00-\u9FA5]+/gm, "");
  }

  /**
   * 转义元字符
   */
  export function escapeMetaCharacter(input: string) {
    let metaCharacter = "^$()*+.[]|\\-?{}";
    if (metaCharacter.indexOf(input) >= 0) {
      input = "\\" + input;
    }
    return input;
  }

  /**
   * 转义字符串中的元字符
   */
  export function escapeMetaCharacterOfStr(input: string) {
    return input.replace(/[-$^()*+.\[\]|\\?{}]/gm, "\\$&");
  }

  /**
   * 中文转为unicode编码
   */
  export function chineseToUnicode(input: string) {
    return input.replace(/[\u4E00-\u9FA5]/g, function(matchStr) {
      return "\\u" + matchStr.charCodeAt(0).toString(16);
    });
  }

  /**
   * 自定义嵌套符号rule={'(':')','[':']','{':'}','<':'>'};
   * @param rule
   * @param str
   */
  export function isNest(rule: object, str: string) {
    if (!(rule && str)) {
      return false;
    }
    let keys = [];
    let values = [];
    for (let key in rule) {
      if (rule.hasOwnProperty(key)) {
        keys.push(key);
        values.push(rule[key]);
      }
    }
    let chs = str.split("");
    let len = chs.length;
    let stack = [];
    for (let i = 0; i < len; i++) {
      if (keys.indexOf(chs[i]) > -1) {
        stack.push(rule[chs[i]]);
      } else {
        if (chs[i] === stack[stack.length - 1]) {
          stack.pop();
        } else if (values.indexOf(chs[i]) > -1) {
          return false;
        }
      }
    }
    return stack.length === 0;
  }

  /**
   * 正则表达式
   */
  const VALIDATOR_PATTERNS = {
    //中国电信号码段
    CHINA_TELECOM: /^(?:\+86)?1(?:33|53|7[37]|8[019])\d{8}$|^(?:\+86)?1700\d{7}$/,
    //中国联通号码段
    CHINA_UNICOM: /^(?:\+86)?1(?:3[0-2]|4[5]|5[56]|7[56]|8[56])\d{8}$|^(?:\+86)?170[7-9]\d{7}$/,
    //中国移动号码段
    CHINA_MOBILE: /^(?:\+86)?1(?:3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\d{8}$|^(?:\+86)?1705\d{7}$/,
    //电话座机号码段
    PHONE_CALL: /^(?:\(\d{3,4}\)|\d{3,4}-)?\d{7,8}(?:-\d{1,4})?$/,
    //手机号码
    PHONE_MOBILE: /^(?:\+86)?(?:13\d|14[57]|15[0-35-9]|17[35-8]|18\d)\d{8}$|^(?:\+86)?170[057-9]\d{7}$/,
    //手机号简单校验，不根据运营商分类
    PHONE_SIMPLE: /^(?:\+86)?1\d{10}$/,
    //邮箱地址
    EMAIL_ADDRESS: /^[-\w\+]+(?:\.[-\w]+)*@[-a-z0-9]+(?:\.[a-z0-9]+)*(?:\.[a-z]{2,})$/i,
    //18位身份证编码
    ID_CARD_18_SIMPLE: /^(?:1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5])\d{4}(?:1[89]|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}(?:\d|[xX])$/
  };

  /**
   * 是否手机号码
   */
  export function isPhoneNumber(input: string) {
    return VALIDATOR_PATTERNS.PHONE_SIMPLE.test(input);
  }

  /**
   * 是否手机号码
   */
  export function isPhoneMobile(input: string) {
    return VALIDATOR_PATTERNS.PHONE_MOBILE.test(input);
  }

  /**
   * 是否座机号码
   */
  export function isPhoneCall(input: string) {
    return VALIDATOR_PATTERNS.PHONE_CALL.test(input);
  }

  /**
   * 是否移动号码
   */
  export function isChinaTelecom(input: string) {
    return VALIDATOR_PATTERNS.CHINA_TELECOM.test(input);
  }

  /**
   * 是否移动号码
   */
  export function isChinaUnicom(input: string) {
    return VALIDATOR_PATTERNS.CHINA_UNICOM.test(input);
  }

  /**
   * 是否移动号码
   */
  export function isChinaMobile(input: string) {
    return VALIDATOR_PATTERNS.CHINA_MOBILE.test(input);
  }

  /**
   * 邮箱格式校验
   */
  export function isEmail(input: string) {
    return VALIDATOR_PATTERNS.EMAIL_ADDRESS.test(input);
  }

  /**
   * 18位身份证简单校验
   */
  export function isSimpleIdCard18(idCard: string) {
    return VALIDATOR_PATTERNS.ID_CARD_18_SIMPLE.test(idCard);
  }

  /**
   * 18位身份证校验码校验
   */
  export function checkIdCardCode(idCard: string) {
    let multiplier = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let idData = idCard.split("");
    let len = 17;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += parseInt(idData[i]) * multiplier[i];
    }
    let remainder = sum % 11;
    let checkCodeArr = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    let checkCode = checkCodeArr[remainder];
    return checkCode === idCard[17];
  }

  /**
   * 18位身份证严格校验
   */
  export function isIdCard18(idCard: string) {
    //先校验格式
    if (isSimpleIdCard18(idCard)) {
      //校验日期时间是否合法
      let dateStr = idCard.substr(6, 8);
      let dateStrNew = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3");
      let dateObj = new Date(dateStrNew);
      let month = dateObj.getMonth() + 1;
      if (parseInt(dateStr.substr(4, 2)) === month) {
        return checkIdCardCode(idCard);
      }
    }
    return false;
  }
}

export { strings };
