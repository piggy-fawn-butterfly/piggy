import { res } from "./Res";
import { i18n } from "./i18n";
import { logger } from "./Logger";
import { constants } from "../Const/Constant";

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
class Pool {
  public static s_instance: Pool = new Pool();
  private m_pools: Map<string, NodePool> = null;

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
    let pipeline = [];
    for (let item of pools) {
      let [path, size] = item;
      await res.load(path);
      if (!this.m_pools.has(path) && res.has(path)) {
        let pool = new NodePool(path, path, size);
        this.m_pools.set(path, pool);
        pipeline = pipeline.concat(new Array(size).fill(path));
      }
    }

    const { ON_RESOURCES_LOADING, ON_RESOURCES_LOADED } = constants.EVENT_NAME;
    let current = 0;
    let total = pipeline.length;
    for (let path of pipeline) {
      setTimeout(async () => {
        ++current;
        let item = await res.use(path);
        this.m_pools.get(path).put(item);
        onprogress && onprogress(current, total, item);
        res.dispatch(ON_RESOURCES_LOADING, current, total, path);
        if (current >= total) {
          oncomplete && oncomplete(pools);
          res.dispatch(ON_RESOURCES_LOADED, current, total, pipeline);
        }
      }, 0);
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

  // /**
  //  * 取出对象
  //  * @param prefab_name
  //  */
  // async get(prefab_name: string): Promise<cc.Node> {
  //   return new Promise(async (resolve, reject) => {
  //     if (!this.m_pools.has(prefab_name)) {
  //       reject(new Error(`对象池${prefab_name}不存在`));
  //       resolve(null);
  //     } else {
  //       resolve(this.m_pools.get(prefab_name).get());
  //     }
  //   });
  // }

  get(pool: string) {
    if (!this.m_pools.has(pool)) {
      return Promise.reject(new Error("对象池不存在"));
    }
    return this.m_pools.get(pool).get();
  }

  /**
   * 存入对象
   * @param prefab_name
   * @param node
   */
  put(prefab_name: string, node: cc.Node) {
    if (!this.m_pools.has(prefab_name)) return;
    this.m_pools.get(prefab_name).put(node);
  }

  /**
   * 清理对象池
   * @param prefab_name
   */
  clear(prefab_name: string) {
    if (!this.m_pools.has(prefab_name)) return;
    this.m_pools.get(prefab_name).clear();
  }

  /**
   * 输出信息
   */
  dump() {
    let data = [];
    this.m_pools.forEach(pool => {
      data.push(`${pool.name()}: ${pool.size()}/${pool.capacity()}`);
    });
    logger.info(i18n.I.text(i18n.K.pool_information), ...data);
  }
}

class NodePool {
  private m_prefab: string; //对象池对象模板
  private m_pool: cc.NodePool; //对象池
  private m_capacity: number; //对象池实际容量
  private m_extend: number; //空间不足时自动扩充数量

  constructor(
    prefab: string,
    name: string,
    capacity: number = 1,
    extend: number = 5
  ) {
    this.m_pool = new cc.NodePool(name);
    this.m_prefab = prefab;
    this.m_capacity = Math.max(1, capacity | 0);
    this.m_extend = Math.max(1, extend | 0);
  }

  async load(size: number = 1) {
    let node = await res.use(this.m_prefab);
    if (node) {
      this.put(node);
      this.m_capacity += size;
    }
  }

  /**
   * 扩充对象池
   * @param size
   */
  private async _extend() {
    if (!res.has(this.m_prefab)) return;
    for (let i = 0; i < this.m_extend; i++) {
      this.put(await res.use(this.m_prefab));
    }
    this.m_capacity += this.m_extend;
  }

  /**
   * 获取对象池名称
   */
  name() {
    return this.m_pool.poolHandlerComp;
  }

  /**
   * 获取对象池模板
   */
  template() {
    return this.m_prefab;
  }

  /**
   * 获取对象池当前容量
   */
  size() {
    return this.m_pool.size();
  }

  /**
   * 获取对象池最大容量
   */
  capacity() {
    return this.m_capacity;
  }

  /**
   * 提取对象池对象
   */
  async get() {
    if (this.size() === 0) await this._extend();
    return this.m_pool.get();
  }

  /**
   * 回收对象到对象池
   * @param node
   */
  put(node: cc.Node) {
    this.m_pool.put(node);
  }

  /**
   * 清空对象池
   */
  clear() {
    res.unUse(this.m_prefab, this.m_capacity);
    this.m_pool.clear();
  }
}

export const pool = Pool.s_instance;
