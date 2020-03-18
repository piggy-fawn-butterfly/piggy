import { piggy } from "../piggy";

/**
 * @class pool
 * @description 对象池
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class pool {
  /**
   *
   * @param {string} prefab 预制体
   * @param {string} name 名称
   * @param {number} capacity 初始容量
   * @param {number} extend 每次自动扩充数量
   */
  constructor( prefab, name, capacity = 1, extend = 5 ) {
    this.m_pool = new cc.NodePool( name );
    this.m_prefab = prefab;
    this.m_capacity = Math.max( 1, capacity | 0 );
    this.m_extend = Math.max( 1, extend | 0 );
  }

  /**
   * 加载对象
   * @param {number} size 加载数量
   */
  load( size = 1 ) {
    let node = piggy.res.use( this.m_prefab );
    if ( node && node instanceof cc.Node ) {
      this.put( node );
      this.m_capacity += size;
    }
  }

  /**
   * 扩充对象池
   */
  _extend() {
    if ( !piggy.res.has( this.m_prefab ) ) return;
    for ( let i = 0; i < this.m_extend; i++ ) {
      let node = piggy.res.use( this.m_prefab );
      if ( node && node instanceof cc.Node )
        this.put( node );
    }
    this.m_capacity += this.m_extend;
  }

  /**
   * 获取对象池名称
   * @returns {string | Function}
   */
  name() {
    return this.m_pool.poolHandlerComp;
  }

  /**
   * 获取对象池模板
   * @returns {string}
   */
  template() {
    return this.m_prefab;
  }

  /**
   * 获取对象池当前容量
   * @returns {number}
   */
  size() {
    return this.m_pool.size();
  }

  /**
   * 获取对象池最大容量
   * @returns {number}
   */
  capacity() {
    return this.m_capacity;
  }

  /**
   * 提取对象池对象
   * @returns {cc.Node}
   */
  get() {
    if ( this.size() === 0 ) this._extend();
    return this.m_pool.get();
  }

  /**
   * 回收对象到对象池
   * @param {cc.Node} node
   */
  put( node ) {
    this.m_pool.put( node );
  }

  /**
   * 清空对象池
   */
  clear() {
    piggy.res.unUse( this.m_prefab, this.m_capacity );
    this.m_pool.clear();
  }
}
