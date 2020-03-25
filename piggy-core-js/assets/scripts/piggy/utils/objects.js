/**
 * @file objects
 * @description 对象扩展库
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export const objects = {
  /**
   * 简单拷贝
   * @param {object} obj 对象或其他数据
   * @returns {any}
   */
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};
