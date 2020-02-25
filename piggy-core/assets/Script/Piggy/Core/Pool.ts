/**
 * @file Pool
 * @description 对象池管理器
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

import { res } from "./Res";
import { logger } from "./Logger";
// import { UIStack } from "./UIStack";

/**
 * 对象池实现
 * @summary
 * - 使用对象池之前需要先加载对应的prefab
 * ```
 */
class Pool {
  public static s_instance: Pool = new Pool();
  private m_pools: Map<string, cc.NodePool> = null;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.m_pools = new Map();
  }

  /**
   * 加载对象池
   * @param pools 池子配置
   */
  public async load(
    pools: Array<[string, number]>,
    onprogress?: Function,
    oncomplete?: Function
  ) {
    let _pools = [];
    for (let i = 0; i < pools.length; i++) {
      let cfg = pools[i];
      let [name, size] = cfg;
      let asset = res.get(name);
      if (asset) {
        let pool = new cc.NodePool(name);
        pool["_size"] = size;
        _pools.push(cfg);
        this.m_pools.set(name, pool);
      }
    }

    let pipeline = [];
    for (let i = 0; i < pools.length; i++) {
      let [name, size] = pools[i];
      for (let j = 0; j < size; j++) {
        pipeline.push(name);
      }
    }
    let current = 0;
    let total = pipeline.length;
    for (let i = 0; i < pipeline.length; i++) {
      current++;
      let name = pipeline[i];
      let item = await res.use(name);
      this.m_pools.get(name).put(item);
      onprogress && onprogress(current, total, item);
      // uiStack.onProgress(current, total, name);
      if (i === total - 1) {
        oncomplete && oncomplete(pools);
        // uiStack.onComplete();
      }
    }
  }

  /**
   * 卸载对象池
   * @param prefab_name
   */
  unload(prefab_name: string) {
    if (this.m_pools.has(prefab_name)) {
      this.clear(prefab_name);
      res.unload(prefab_name);
      this.m_pools.delete(prefab_name);
    }
  }

  /**
   * 取出对象
   * @param prefab_name
   */
  async get(prefab_name: string): Promise<cc.Node> {
    return new Promise(async (resolve, reject) => {
      if (!this.m_pools.has(prefab_name)) {
        reject(new Error(`对象池${prefab_name}不存在`));
        resolve(null);
        return;
      }
      let pool = this.m_pools.get(prefab_name);
      if (pool.size() > 0) {
        resolve(pool.get());
        return;
      }
      let item = await res.use(prefab_name);
      pool.put(item);
      pool["_size"] += 1;
      return pool.get();
    });
  }

  /**
   * 存入对象
   * @param prefab_name
   * @param node
   */
  put(prefab_name: string, node: cc.Node) {
    if (this.m_pools.has(prefab_name)) {
      this.m_pools.get(prefab_name).put(node);
    }
  }

  /**
   * 清理对象池
   * @param prefab_name
   */
  clear(prefab_name: string) {
    if (this.m_pools.has(prefab_name)) {
      let pool = this.m_pools.get(prefab_name);
      res.unUse(prefab_name, pool.size());
      pool.clear();
    }
  }

  /**
   * 输出信息
   */
  dump() {
    let data = [];
    this.m_pools.forEach((pool: cc.NodePool) => {
      let item = `对象池:${pool.poolHandlerComp}\n`;
      item += `  数量: ${pool.size()}\n`;
      item += `  总数: ${pool["_size"]}`;
      data.push(item);
    });
    logger.info("对象池数据", ...data);
  }
}

export const pool = Pool.s_instance;
