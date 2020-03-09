import fs from "fs";
import path from "path";
import { v4 } from "uuid";

/**
 * @file Common
 * @description 公共方法
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
 * 获得uuid
 */
export function uuidV4() {
  return v4();
}

/**
 * JSON 转 Buffer
 * @param {string} type
 * @param {object} msg
 */
export function toMsg(type: string, msg: object) {
  return Buffer.from(JSON.stringify({ type: type, msg: msg }), "utf8");
}

/**
 * Buffer 转 JSON
 * @param {Buffer} message
 */
export function fromMsg(message: Buffer) {
  return JSON.parse(message.toString("utf8"));
}

/**
 * 对象长度
 * @param {object} obj
 */
export function objectSize(obj: object) {
  return (
    Object.getOwnPropertyNames(obj).length +
    Object.getOwnPropertySymbols(obj).length
  );
}

/**
 * 读取文件内容
 * @param {string} filename
 */
export function cat(filename: string) {
  return fs.readFileSync(path.resolve(__dirname, "../" + filename), "utf8");
}

/**
 * 值是否属于参考列表
 * @param val 指定值
 * @param values 指定参考值列表
 */
export function is(val: any, values: any[]) {
  return values.some(v => {
    return v === val;
  });
}
