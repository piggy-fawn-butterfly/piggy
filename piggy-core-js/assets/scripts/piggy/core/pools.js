import {pool as PoolClass} from "./pool";

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
    this.m_pools = new Map();
  }

  /**
   * 加载对象池
   * @param {Array<[ string, number ]>} pools 池子配置
   * @param {Function} onprogress
   * @param {Function} oncomplete
   */
  load( pools, onprogress, oncomplete ) {
    let pipeline = [];
    for ( let item of pools ) {
      let [ path, size ] = item;
      piggy.res.load( path );
      if ( !this.m_pools.has( path ) && piggy.res.has( path ) ) {
        let pool = new PoolClass(path, path, size);
        this.m_pools.set( path, pool );
        pipeline = pipeline.concat( new Array( size ).fill( path ) );
      }
    }

    const { ON_RESOURCES_LOADING, ON_RESOURCES_LOADED } = piggy.constants.EVENT_NAME;
    let current = 0;
    let total = pipeline.length;
    for ( let path of pipeline ) {
      setTimeout( () => {
        ++current;
        let item = piggy.res.use( path );
        this.m_pools.get( path ).put( item );
        onprogress && onprogress( current, total, item );
        piggy.res.dispatch( ON_RESOURCES_LOADING, current, total, path );
        if ( current >= total ) {
          oncomplete && oncomplete( pools );
          piggy.res.dispatch( ON_RESOURCES_LOADED, current, total, pipeline );
        }
      }, 0 );
    }
  }

  /**
   * 卸载对象池
   * @param {string} pool 对象池名称
   */
  unload( pool ) {
    if ( this.m_pools.has( pool ) ) {
      this.clear( pool );
      piggy.res.unload( pool );
      this.m_pools.delete( pool );
    }
  }

  /**
   * 取出对象
   * @param {string} pool 对象池名称
   * @returns {cc.Node}
   */
  get( pool ) {
    if ( !this.m_pools.has( pool ) ) return null;
    return this.m_pools.get( pool ).get();
  }

  /**
   * 存入对象
   * @param {string} pool 对象池名称
   * @param {cc.Node} node
   */
  put( pool, node ) {
    if ( !this.m_pools.has( pool ) ) return;
    this.m_pools.get( pool ).put( node );
  }

  /**
   * 清理对象池
   * @param {string} pool 对象池名称
   */
  clear( pool ) {
    if ( !this.m_pools.has( pool ) ) return;
    this.m_pools.get( pool ).clear();
  }

  /**
   * 输出信息
   */
  dump() {
    let data = [];
    this.m_pools.forEach( pool => {
      data.push( `${ pool.name() }: ${ pool.size() }/${ pool.capacity() }` );
    } );
    piggy.logger.info( piggy.i18n.t( piggy.i18nK.pool_information ), ...data );
  }
}
