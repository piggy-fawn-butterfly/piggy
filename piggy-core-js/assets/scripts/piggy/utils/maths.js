/**
 * @file maths
 * @description 数学扩展库
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export const maths = {
  /**
   * 随机整数 [min, max]
   * @param {number} min 下限
   * @param {number} max 上限
   * @returns {number}
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  /**
   * 随机浮点数 [min, max]
   * @param {number} min 下限
   * @param {number} max 上限
   * @returns {number}
   */
  randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
};
