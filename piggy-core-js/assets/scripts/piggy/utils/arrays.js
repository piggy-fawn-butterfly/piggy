/** @format */

export const arrays = {
  /**
   * 打乱数组后返回新的数组，不会修改原数组
   * 可用于洗牌算法
   * @param {any[]} arr 原数组
   * @param {number} len 随机取长度
   * @returns {any[]}
   */
  shuffle(arr, len = arr.length) {
    let arr_copy = arr.concat();
    let rest = arr_copy.length;
    for (let i = arr_copy.length - 1; i >= 0; i--) {
      const random = (Math.random() * --rest) | 0;
      [arr_copy[i], arr_copy[random]] = [arr_copy[random], arr_copy[i]];
    }
    return arr_copy.slice(0, len);
  },

  /**
   * 打乱数组后返回新的数组，修改原数组
   * 可用于洗牌算法
   * @param {any[]} arr 原数组
   * @param {number} len 随机取长度
   * @returns {any[]}
   */
  shuffleSelf(arr, len = arr.length) {
    let rest = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) {
      const random = (Math.random() * --rest) | 0;
      [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr.slice(0, len);
  },

  /**
   * 从数组中移除某个值，匹配第一个
   * @param {any[]} arr 原数组
   * @param {any} val 需要移除的设定值
   * @returns {number} 被移除的数组元素索引
   */
  removeFrom(arr, val) {
    let index = arr.findIndex(v => {
      return v === val;
    });
    index > -1 && arr.splice(index, 1);
    return index;
  },

  /**
   * 从数组中随机获取一项
   * @param {any[]} arr
   * @returns {any[]} 数组项
   */
  randomFrom(arr) {
    return this.shuffle(arr, 1)[0];
  },

  /**
   * 数组转集合
   * @param {any} arr
   * @returns 数组项
   */
  toSet(arr) {
    let set = new Set();
    arr.forEach(v => set.add(v));
    return set;
  },

  /**
   * Map转数组
   * @param {Map<string, any> } map Map
   */
  fromMap(map) {
    return Array.from(map.entries());
  },

  /**
   * Map转对象
   * @param map Map
   */
  mapToObject(map) {
    let obj = Object.create(null);
    map.forEach((V, K) => {
      obj[K] = V;
    });
    return obj;
  },

  /**
   * 获得数组最大值
   * @param {number[]} arr 数组
   */
  max(arr) {
    return Math.max.apply(Math, arr);
  },

  /**
   * 获得最大值
   * @param {number[]} arr 数组
   */
  min(arr) {
    return Math.min.apply(Math, arr);
  },

  /**
   * 数组合并
   * @param {any[]} arr 第一个数组
   * @param {any[]} args
   */
  union(arr, ...args) {
    if (!Array.isArray(arr)) {
      throw new TypeError("arr-union expects the first argument to be an array.");
    }

    let len = args.length;
    let i = -1;
    while (++i < len) {
      let arg = args[i];
      if (!arg) continue;

      if (!Array.isArray(arg)) {
        arg = [arg];
      }

      for (let j = 0; j < arg.length; j++) {
        let ele = arg[j];
        if (arr.indexOf(ele) >= 0) continue;
        arr.push(ele);
      }
    }
    return arr;
  }
};
