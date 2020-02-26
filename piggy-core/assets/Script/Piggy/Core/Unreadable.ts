import { maths } from "../Utils/Maths";

/**
 * @class
 * @file Unreadable
 * @description 字符串可读性处理
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
class Unreadable {
  private static disturb_num = 0;
  private static offset_num = 766;
  private static range_min = 766;
  private static range_max = 879;

  /**
   * 随机一个不可读字符
   */
  private static disturb(): string {
    return String.fromCharCode(maths.randomInt(this.range_min, this.range_max));
  }

  /**
   * 随机num个不可读字符串
   * @param num 随机个数
   */
  static disturb_n(num: number): string {
    return new Array(num)
      .fill(0, 0, num)
      .map(() => {
        return this.disturb();
      })
      .join("");
  }

  /**
   * 字符偏移转换-执行
   * @param char 字符
   * @param offset 偏移
   */
  private static _encode(char: string, offset: number) {
    return String.fromCharCode(char.charCodeAt(0) + offset);
  }

  /**
   * 字符偏移转换-还原
   * @param char 字符
   * @param offset 偏移
   */
  private static _decode(char: string, offset: number) {
    return String.fromCharCode(char.charCodeAt(0) - offset);
  }

  /**
   * 执行字符串不可读操作
   * @param str 字符串
   * @param disturb 干扰等级
   * @param offset 偏移值
   */
  static encode(
    str: string,
    disturb: number = Unreadable.disturb_num,
    offset: number = Unreadable.offset_num
  ) {
    return Array.prototype.map
      .call(str, (char: string) => {
        return this._encode(char, offset) + this.disturb_n(disturb);
      })
      .join("");
  }

  /**
   * 还原字符串可读性操作
   * @param str 字符串
   * @param disturb 干扰等级
   * @param offset 偏移值
   */
  static decode(
    str: string,
    disturb: number = Unreadable.disturb_num,
    offset: number = Unreadable.offset_num
  ) {
    return Array.prototype.map
      .call(str, (char: string, index: number) => {
        let out = index % (disturb + 1) === 0;
        return out ? this._decode(char, offset) : "";
      })
      .join("");
  }
}

export { Unreadable as unreadable };
