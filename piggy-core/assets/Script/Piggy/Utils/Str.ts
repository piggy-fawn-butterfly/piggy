/**
 * @file Str
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
