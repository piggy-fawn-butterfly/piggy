/**
 * @file res
 * @description 资源管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class res {
  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_builtin_res = new Array(0);
    this.m_path_type = new Map();
    this.m_cache_asset = new Map();
  }

  /**
   * 初始化
   */
  init() {
    this._builtinDependUrls();
    this._linkPathAndType();
    let info = piggy.i18n.t( piggy.i18nK.builtin_resources );
    piggy.logger.info( info, ...this.m_builtin_res );
    info = piggy.i18n.t( piggy.i18nK.map_of_resources_path_and_type );
    piggy.logger.info( info, ...Array.from( this.m_path_type.entries() ) );
  }

  /**
   * 资源路径的文件名称
   * @param {string} path
   * @returns {string}
   */
  basenameOf( path ) {
    return cc.path.basename( path );
  }

  /**
   * 缓存中是否有资源
   * @param {string} path 资源路径
   * @returns {boolean}
   */
  has( path ) {
    return this.m_cache_asset.has( path );
  }

  /**
   * 获得缓存中的资源
   * @param {string} path 资源路径
   * @return {typeof cc.Asset | cc.Prefab}
   */
  get( path ) {
    let asset_info = this._get( path );
    if ( !asset_info ) return null;
    return asset_info.asset;
  }

  /**
  * 获得资源原始类型
  * @param {string} path 资源路径
  * @returns {string}
  */
  typeOf( path ) {
    return this.m_path_type.get( path );
  }

  /**
   * 判断资源是否存在资源列表中
   * @param {string} path 资源路径
   * @returns {boolean}
   */
  contains( path ) {
    return this.m_path_type.has( path );
  }

  /**
   * 判断资源路径是否与资源类型对应
   * @param {string} path 资源路径
   * @param {string} type 资源类型
   * @returns {boolean}
   */
  isTypeOf( path, type ) {
    return this.typeOf( path ) === type;
  }

  /**
   * 分发加载进度和加载完成事件
   * @param {string} event_name 事件名称
   * @param {number} current 当前进度
   * @param {number} total 全部进度
   * @param {string | string[]} asset 资源路径
   */
  dispatch( event_name, current, total, asset ) {
    piggy.events.dispatch( event_name, {
      current: current,
      total: total,
      asset: asset
    } );
  }
  
  /**
   * 加载资源
   * @param {string | string[]}paths 资源路径
   * @param {Function} onprogress 资源加载进度回调
   * @param {Function} oncomplete
   */
  load( paths, onprogress = function() { }, oncomplete = function() { } ) {
    paths = Array.prototype.concat( paths );
    //筛选出有效的资源条目：不存在的、重复的、已经加载的将被过滤
    let valid_paths = new Map();
    for ( let path of paths ) {
      if ( this.m_cache_asset.has( path ) ) continue;
      if ( valid_paths.has( path ) ) continue;
      let type = this.typeOf( path );
      if ( !type ) continue;
      let cls = type.split( "." ).pop();
      if ( !cls ) continue;
      if ( !cc[ cls ] ) continue;
      if (
        cc.js.getClassName( cc[ cls ] ) === "cc.Asset" ||
        cc.js.getClassName( cc.js.getSuper( cc[ cls ] ) ) === "cc.Asset"
      )
        valid_paths.set( path, cc[ cls ] );
    }

    //异步加载资源
    const { ON_RESOURCES_LOADING, ON_RESOURCES_LOADED } = piggy.constants.EVENT_NAME;
    let path_arr = piggy.arrays.fromMap( valid_paths );
    let total = path_arr.length;
    if ( total === 0 ) return oncomplete( null );
    let self = this, assets = [], current = 0;
    function next() {
      let path_info = path_arr.shift();
      if ( path_info ) {
        current++;
        let [ path, type ] = path_info;
        self._loadRes( path, type, asset => {
          if ( asset ) {
            assets.push( path );
            self.m_cache_asset.set( path, { asset: asset, use: 0 } );
            onprogress( current, total, asset );
            self.dispatch( ON_RESOURCES_LOADING, current, total, path );
          }
          next();
        } );
      } else {
        let text = piggy.i18n.t( piggy.i18nK.how_many_resources_loaded );
        let info = piggy.strings.render( text, { num: assets.length } );
        assets.length > 0 && piggy.logger.info( info, ...assets );
        self.dispatch( ON_RESOURCES_LOADED, current, total, assets );
        oncomplete( assets );
      }
    }
    next();
  }

  /**
   * 卸载资源
   * @param {string} path 需要卸载的资源
   */
  unload( path ) {
    let asset_info = this.m_cache_asset.get( path );
    //资源不存在
    if ( !asset_info ) {
      let info = piggy.i18n.t( piggy.i18nK.unload_failed_for_non_exist );
      let warn = piggy.strings.render( info, { path: path } );
      return piggy.logger.warn( warn );
    }
    //资源正在使用中
    if ( asset_info.use > 0 ) {
      let info = piggy.i18n.t( piggy.i18nK.unload_failed_for_in_use );
      let warn = piggy.strings.render( info, { path: path, use: asset_info.use } );
      return piggy.logger.warn( warn );
    }
    //获取自身依赖的资源
    let deps = this._getAssetDependUrls( asset_info.asset );
    //从依赖中删除被其他项目依赖的资源
    this.m_cache_asset.forEach( ( asset_info, url ) => {
      if ( url !== path ) {
        let asset_deps = this._getAssetDependUrls( asset_info.asset );
        asset_deps.forEach(asset => piggy.arrays.removeFrom(deps, asset));
      }
    } );
    //释放处理后的资源
    cc.loader.release( deps );
    this.m_cache_asset.delete( path );
    this.dump();
  }

  /**
   * 使用资源
   * @param {string} path 资源路径
   * @returns {cc.Node | cc.Prefab | typeof cc.Asset}
   */
  use( path ) {
    let loaded = false;
    if ( this.has( path ) ) {
      loaded = true;
      return this._use( loaded, path );
    } else if ( path && this.m_path_type.has( path ) ) {
      this.load( path, null, assets => {
        loaded = assets.length > 0;
      } );
      return this._use( loaded, path );
    }
  }

  /**
   * 使用资源
   * @param {boolean} loaded 是否已加载
   * @param {string} path 资源路径
   * @returns {cc.Node | cc.Prefab | typeof cc.Asset}
   */
  _use( loaded, path ) {
    if (!loaded) {
      piggy.logger.error(piggy.i18n.t(piggy.i18nK.invalid_resource_path));
      return null;
    }
    let asset_type = this.m_path_type.get(path);
    let asset_info = this._get(path);
    let asset = asset_info.asset;
    asset_info.use++;
    if (asset_type === "cc.Prefab") {
      return this._instantiate(asset);
    } else {
      return asset;
    }
  }
  
  /**
   * 加载
   * @param {string} path 资源路径
   * @param {typeof cc.Asset} type 资源类型
   * @param {Function} oncomplete
   */
  _loadRes( path, type, oncomplete ) {
    cc.loader.loadRes( path, type, ( err, asset ) => {
      oncomplete( err ? null : asset );
    } );
  }

  /**
   * 实例化 Prefab
   * @param {cc.Prefab | typeof cc.Asset} prefab 资源
   * @returns {cc.Node}
   */
  _instantiate( prefab ) {
    let node = cc.instantiate( prefab );
    if ( node instanceof cc.Node ) {
      node.setPosition( 0, 0 );
      return node;
    }
    return null;
  }
  
  /**
   * 解除资源占用
   * @param {string} path 资源
   * @param {number} count
   */
  unUse( path, count = 1 ) {
    count = Math.max( 1, count );
    let asset = this.m_cache_asset.get( path );
    asset && ( asset.use = Math.max( 0, asset.use - count ) );
  }

  /**
   * 解除资源并卸载
   * @param {string} path 资源
   */
  unUseThenUnload( path ) {
    this.unUse( path );
    this.unload( path );
  }

  /**
   * 获得调试信息
   * cc.loader依赖 = 内置资源依赖 + 资源缓存依赖 + 程序脚本数量
   */
  _debugInfo() {
    let cache_count = this._getCCLoaderCacheCount();
    let builtin_depends = this.m_builtin_res.length;
    let scene_depends = this._getSceneDependUrls().length;
    let cache_depends = this._getCacheDependUrls().length;
    let debug_info = [
      piggy.i18n.t( piggy.i18nK.builtin_depend_urls ) + builtin_depends,
      piggy.i18n.t( piggy.i18nK.scene_depend_urls ) + scene_depends,
      piggy.i18n.t( piggy.i18nK.cache_depend_urls ) + cache_depends,
      piggy.i18n.t( piggy.i18nK.cc_loader_cache_urls ) + cache_count.refers,
      piggy.i18n.t( piggy.i18nK.static_script_files ) + cache_count.excludes,
      piggy.i18n.t( piggy.i18nK.resources_cache_count ),
      Array.from( this.m_cache_asset.keys() ).join( "\n" )
    ];
    return debug_info.join( "\n" );
  }

  /**
   * 输出信息
   */
  dump() {
    let info = piggy.i18n.t( piggy.i18nK.resources_debug_info );
    piggy.logger.info( info, this._debugInfo() );
    info = piggy.i18n.t( piggy.i18nK.resource_cache_info );
    piggy.logger.info( info, Array.from( this.m_cache_asset ) );
    // piggy.logger.info("cc.loader._cache:", cc.loader["_cache"]);
  }

  /**
   * 资源类型回退
   * @param {string[]} types 类型列表
   */
  _resTypeFallback( types ) {
    for ( let i = 0; i < piggy.constants.RES_TYPE_FALLBACKS.length; i++ ) {
      let type = piggy.constants.RES_TYPE_FALLBACKS[ i ];
      if ( types.indexOf( type ) >= 0 ) {
        return type;
      }
    }
  }

  /**
   * 建立资源路径与类型的映射
   */
  _linkPathAndType() {
    let assets = cc.loader[ "_assetTables" ][ "assets" ][ "_pathToUuid" ];
    let _types = new Set();
    for ( let path in assets ) {
      if (!assets.hasOwnProperty(path)) continue;
      let entries = [];
      let _entries = assets[ path ];
      _entries instanceof Array
        ? entries.push( ..._entries )
        : entries.push( _entries );
      let types = [];
      entries.forEach( entry => {
        let classname = cc.js.getClassName( entry.type );
        piggy.constants.RES_TYPE_LIST.has( classname ) && types.push( classname );
        _types.add( classname );
      } );
      this.m_path_type.set( path, this._resTypeFallback( types ) );
    }
    piggy.logger.info(
      piggy.i18n.t( piggy.i18nK.resources_type_in_cache ),
      ...Array.from( _types )
    );
  }

  /**
   * 获得缓存中的资源
   * @param { string } path 资源路径
   * @returns { {asset:typeof cc.Asset | cc.Prefab, use:number} }
   */
  _get( path ) {
    return this.m_cache_asset.get( path );
  }

  /**
   * 获得内置资源列表
   */
  _builtinDependUrls() {
    this.m_builtin_res = Object.keys( cc[ "AssetLibrary" ][ "getBuiltinDeps" ]() );
  };

  /**
   * 获得资源依赖
   * @param {cc.Asset} asset 资源
   * @returns {string[]}
   */
  _getAssetDependUrls( asset ) {
    return cc.loader.getDependsRecursively( asset );
  };

  /**
   * 获得已缓存的所有资源的依赖
   * @returns {string[]}
   */
  _getCacheDependUrls() {
    let set = new Set();
    this.m_cache_asset.forEach( asset_info => {
      this._getAssetDependUrls( asset_info.asset ).forEach( url => {
        this.m_builtin_res.indexOf( url ) === -1 && set.add( url );
      } );
    } );
    return Array.from( set );
  };

  /**
   * 获得场景资源依赖
   * @returns {string[]} 资源依赖数组
   */
  _getSceneDependUrls( scene = null ) {
    scene = scene || cc.director.getScene();
    if ( scene.dependAssets ) {
      return scene.dependAssets.filter( url => this.m_builtin_res.indexOf( url ) === -1 );
    }
    return [];
  }
  
  /**
   * 获得cc.loader._cache中排除脚本资源的资源总数
   * 排除：js
   * @returns {{refers:number, excludes: number}}
   */
  _getCCLoaderCacheCount() {
    let cache = cc.loader._cache;
    let data = { refers: 0, excludes: 0 };
    for ( let url in cache ) {
      if (cache.hasOwnProperty(url)) {
        let res_type = cache[url].type;
        piggy.constants.RES_TYPE_IN_CACHE_TO_EXCLUDES.has(res_type)
          ? data.excludes++
          : data.refers++;
      }
    }
    return data;
  }
}

