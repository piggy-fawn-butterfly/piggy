import { pool } from "./pool";

/**
 * @file pools
 * @description 对象池管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class pools {
  /**
   * 隐藏构造器
   */
  constructor() {
    /**
     * 对象池列表
     * @type {Map<string, pool>}
     */
    this.m_pools = new Map();
  }

  /**
   * 加载对象池
   * @param {Array<[ string, number ]>} pools 池子配置
   * @param {Function} onprogress
   * @param {Function} oncomplete
   */
  load(pools, onprogress, oncomplete) {
    let pipeline = [];
    for (let item of pools) {
      let [path, size] = item;
      piggy.res.load(path);
      if (!this.m_pools.has(path) && piggy.res.has(path)) {
        let poolHandler = new pool(path, path, size);
        this.m_pools.set(path, poolHandler);
        pipeline = pipeline.concat(new Array(size).fill(path));
      }
    }

    const { ON_RESOURCES_LOADING, ON_RESOURCES_LOADED } = piggy.constants.EVENT_NAME;
    let current = 0;
    let total = pipeline.length;
    for (let path of pipeline) {
      setTimeout(() => {
        ++current;
        let item = piggy.res.use(path);
        this.m_pools.get(path).put(item);
        onprogress && onprogress(current, total, item);
        piggy.res.dispatch(ON_RESOURCES_LOADING, current, total, path);
        if (current >= total) {
          oncomplete && oncomplete(pools);
          piggy.res.dispatch(ON_RESOURCES_LOADED, current, total, pipeline);
        }
      }, 0);
    }
  }

  /**
   * 卸载对象池
   * @param {string} poolName 对象池名称
   */
  unload(poolName) {
    if (this.m_pools.has(poolName)) {
      this.clear(poolName);
      piggy.res.unload(poolName);
      this.m_pools.delete(poolName);
    }
  }

  /**
   * 取出对象
   * @param {string} poolName 对象池名称
   * @returns {cc.Node}
   */
  get(poolName) {
    if (!this.m_pools.has(poolName)) return null;
    return this.m_pools.get(poolName).get();
  }

  /**
   * 存入对象
   * @param {string} poolName 对象池名称
   * @param {cc.Node} node
   */
  put(poolName, node) {
    if (!this.m_pools.has(poolName)) return;
    this.m_pools.get(poolName).put(node);
  }

  /**
   * 清理对象池
   * @param {string} poolName 对象池名称
   */
  clear(poolName) {
    if (!this.m_pools.has(poolName)) return;
    this.m_pools.get(poolName).clear();
  }

  /**
   * 输出信息
   */
  dump() {
    let data = [];
    this.m_pools.forEach(poolHandler => {
      data.push(`${poolHandler.name()}: ${poolHandler.size()}/${poolHandler.capacity()}`);
    });
    piggy.logger.info(piggy.i18n.t(piggy.i18nK.pool_information), ...data);
  }
}
