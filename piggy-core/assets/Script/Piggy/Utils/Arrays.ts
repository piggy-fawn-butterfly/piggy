/**
 * @file Arrays
 * @description 数组扩展
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
namespace arrays {
  /**
   * 打乱数组后返回新的数组，不会修改原数组
   * 可用于洗牌算法
   * @param arr 原数组
   * @param len 随机取长度
   */
  export function shuffle(
    arr: Array<any>,
    len: number = arr.length
  ): Array<any> {
    let arr_copy = arr.concat();
    let rest = arr_copy.length;
    for (let i = arr_copy.length - 1; i >= 0; i--) {
      const random = (Math.random() * --rest) | 0;
      [arr_copy[i], arr_copy[random]] = [arr_copy[random], arr_copy[i]];
    }
    return arr_copy.slice(0, len);
  }

  /**
   * 打乱数组后返回新的数组，修改原数组
   * 可用于洗牌算法
   * @param arr 原数组
   * @param len 随机取长度
   */
  export function shuffleSelf(
    arr: Array<any>,
    len: number = arr.length
  ): Array<any> {
    let rest = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) {
      const random = (Math.random() * --rest) | 0;
      [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr.slice(0, len);
  }

  /**
   * 从数组中移除某个值，匹配第一个
   * @param arr 原数组
   * @param val 需要移除的设定值
   * @returns index 被移除的数组元素索引
   */
  export function removeFrom(arr: Array<any>, val: any): number {
    let index = arr.findIndex(v => {
      return v === val;
    });
    index > -1 && arr.splice(index, 1);
    return index;
  }

  /**
   * 从数组中随机获取一项
   * @param arr
   * @returns 数组项
   */
  export function randomFrom(arr: Array<any>): any {
    return shuffle(arr, 1)[0];
  }

  /**
   * 数组转集合
   * @param arr
   * @returns 数组项
   */
  export function toSet<T>(arr: Array<T>): Set<T> {
    let set = new Set<T>();
    arr.forEach(v => {
      set.add(v);
    });
    return set;
  }

  /**
   * Map转数组
   * @param map Map
   */
  export function fromMap<T>(map: Map<string, T>) {
    return Array.from(map.entries());
  }

  /**
   * Map转对象
   * @param map Map
   */
  export function mapToObject<T>(map: Map<string, T>): object {
    let obj: object = Object.create(null);
    map.forEach((V, K) => {
      obj[K] = V;
    });
    return obj;
  }

  /**
   * 获得数组最大值
   * @param arr 数组
   */
  export function max(arr: [number]): number {
    return Math.max.apply(Math, arr);
  }

  /**
   * 获得最大值
   * @param arr 数组
   */
  export function min(arr: [number]): number {
    return Math.min.apply(Math, arr);
  }

  /**
   * 判断某个值是否在数组
   */
  export function inArray<T>(arr: [T], ele: T): boolean {
    return arr.indexOf(ele) > -1;
  }

  /**
   * 数组合并
   * @param init 第一个数组
   */
  export function union(init: Array<any>, ...args: any) {
    if (!Array.isArray(init)) {
      throw new TypeError(
        "arr-union expects the first argument to be an array."
      );
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

        if (init.indexOf(ele) >= 0) {
          continue;
        }
        init.push(ele);
      }
    }
    return init;
  }
}

export { arrays };
