import { constants } from "../Const/Constant";
import { interfaces } from "../Const/Declare/Interfaces";
import { arrays } from "../Utils/Arrays";
import { strings } from "../Utils/Strings";
import { i18n } from "./i18n";
import { logger } from "./Logger";

/**
 * @file Res
 * @description 资源管理器
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
class Res {
  public static s_instance: Res = new Res();

  private m_path_type: Map<string, string>;
  private m_cache_asset: Map<string, interfaces.I_Res_Cache_Asset>;
  private m_builtin_res: Array<string>;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.m_builtin_res = new Array();
    this.m_path_type = new Map();
    this.m_cache_asset = new Map();
  }

  /**
   * 初始化
   */
  public init() {
    this._builtinDependUrls();
    this._linkPathAndType();
    let info = i18n.I.text(i18n.K.builtin_resources);
    logger.info(info, ...this.m_builtin_res);
    info = i18n.I.text(i18n.K.map_of_resources_path_and_type);
    logger.info(info, ...Array.from(this.m_path_type.entries()));
  }

  /**
   * 缓存中是否有资源
   * @param path 资源路径
   */
  public has(path: string): boolean {
    return this.m_cache_asset.has(path);
  }

  /**
   * 获得缓存中的资源
   * @param path 资源路径
   */
  public get<T extends cc.Asset>(path: string): T {
    let asset_info = this._get(path);
    if (asset_info) return <T>asset_info.asset;
    return null;
  }

  /**
   * 获得资源原始类型
   * @param path 资源路径
   */
  public rawType(path: string): string {
    return this.m_path_type.get(path);
  }

  /**
   * 加载资源
   * @param paths 资源路径
   * @param onprogress 资源加载进度回调
   */
  public load(
    paths: string | Array<string>,
    onprogress?: interfaces.I_Progress_Callback
  ): Promise<any> {
    typeof paths === "string" && (paths = [paths]);
    onprogress = onprogress || function() {};
    return new Promise(resolve => {
      //筛选出有效的资源条目：不存在的、重复的、已经加载的将被过滤
      let valid_paths: Map<string, typeof cc.Asset> = new Map();
      for (let path of paths) {
        if (!this.m_cache_asset.has(path)) {
          let type = this.rawType(path);
          if (!type) continue;
          let classname = type.split(".").pop();
          if (!classname) continue;
          cc[classname] &&
            !valid_paths.has(path) &&
            valid_paths.set(path, cc[classname]);
        }
      }

      //异步加载资源
      let path_arr = arrays.fromMap(valid_paths);
      let total: number = path_arr.length;
      if (total === 0) return resolve(null);
      let self: Res = this;
      let assets: Array<string> = [];
      let current: number = 0;
      // let label = `res.load [${total}]`;
      // console.time(label);
      async function next() {
        let path_info = path_arr.shift();
        if (path_info) {
          current++;
          let [path, type] = path_info;
          let asset = await self._loadRes(path, type);
          if (asset) {
            assets.push(path);
            asset["_url"] = path;
            self.m_cache_asset.set(path, { asset: asset, use: 0 });
          }
          onprogress(current, total, asset);
          // UIStack.I.onProgress(current, total, path);
          next();
        } else {
          let text = i18n.I.text(i18n.K.how_many_resources_loaded);
          let info = strings.render(text, { num: assets.length });
          assets.length > 0 && logger.info(info, ...assets);
          resolve(assets);
          // UIStack.I.onComplete();
          // console.timeEnd(label);
        }
      }
      next();
    });
  }

  /**
   * 卸载资源
   * @param path 需要卸载的资源
   */
  public unload(path: string) {
    let asset_info = this.m_cache_asset.get(path);
    //资源不存在
    if (!asset_info) {
      let info = i18n.I.text(i18n.K.unload_failed_for_non_exist);
      let warn = strings.render(info, {
        path: path
      });
      return logger.warn(warn);
    }
    //资源正在使用中
    if (asset_info.use > 0) {
      let info = i18n.I.text(i18n.K.unload_failed_for_in_use);
      let warn = strings.render(info, {
        path: path,
        use: asset_info.use
      });
      return logger.warn(warn);
    }
    //获取自身依赖的资源
    let deps = this._getAssetDependUrls(asset_info.asset);
    //从依赖中删除被其他项目依赖的资源
    this.m_cache_asset.forEach((asset_info, url) => {
      if (url !== path) {
        let asset_deps = this._getAssetDependUrls(asset_info.asset);
        asset_deps.forEach(res => {
          arrays.removeFrom(deps, res);
        });
      }
    });
    //释放处理后的资源
    cc.loader.release(deps);
    this.m_cache_asset.delete(path);
  }

  /**
   * 使用资源
   * @param path 资源路径
   */
  public async use(path: string): Promise<any> {
    let loaded = false;
    if (this.has(path)) {
      loaded = true;
    } else if (path && this.m_path_type.has(path)) {
      loaded = (await this.load(path)).length > 0;
    }
    return new Promise((resolve, reject) => {
      if (!loaded) {
        reject(i18n.I.text(i18n.K.invalid_resource_path));
        return;
      }
      let asset_type = this.m_path_type.get(path);
      let asset_info = this._get(path);
      let asset = asset_info.asset;
      asset_info.use++;
      switch (asset_type) {
        case "cc.Prefab":
          resolve(this._instantiate(<cc.Prefab>asset));
          break;
        default:
          resolve(asset);
      }
    });
  }

  /**
   * 异步加载 Promise 化
   * @param path 资源路径
   * @param type 资源类型
   */
  private _loadRes<T extends typeof cc.Asset>(
    path: string,
    type: T
  ): Promise<InstanceType<T>> {
    return new Promise(resolve =>
      cc.loader.loadRes(path, type, (err, resource) => {
        if (err) {
          resolve(null);
        } else {
          resolve(resource);
        }
      })
    );
  }

  /**
   * 实例化 Prefab
   * @param asset Prefab 资源
   */
  private _instantiate(prefab: cc.Prefab) {
    let node = cc.instantiate(prefab);
    node.setPosition(0, 0);
    return node;
  }

  /**
   * 解除资源占用
   * @param path 资源
   */
  public unUse(path: string, count?: number) {
    count = Math.max(1, count || 1);
    let asset = this.m_cache_asset.get(path);
    asset && (asset.use = Math.max(0, asset.use - count));
  }

  /**
   * 解除资源并卸载
   * @param path 资源
   */
  unUseThenUnload(path: string) {
    this.unUse(path);
    this.unload(path);
  }

  /**
   * 获得调试信息
   * cc.loader依赖 = 内置资源依赖 + 资源缓存依赖 + 程序脚本数量
   */
  private _debugInfo(): string {
    let cache_count = this._getCCLoaderCacheCount();
    let builtin_depends = this.m_builtin_res.length;
    let scene_depends = this._getSceneDependUrls().length;
    let cache_depends = this._getCacheDependUrls().length;
    let debug_info = [
      i18n.I.text(i18n.K.builtin_depend_urls) + builtin_depends,
      i18n.I.text(i18n.K.scene_depend_urls) + scene_depends,
      i18n.I.text(i18n.K.cache_depend_urls) + cache_depends,
      i18n.I.text(i18n.K.cc_loader_cache_urls) + cache_count.refers,
      i18n.I.text(i18n.K.static_script_files) + cache_count.excludes,
      i18n.I.text(i18n.K.resources_cache_count),
      Array.from(this.m_cache_asset.keys()).join("\n")
    ];
    return debug_info.join("\n");
  }

  /**
   * 输出信息
   */
  public dump() {
    let info = i18n.I.text(i18n.K.resources_debug_info);
    logger.info(info, this._debugInfo());
    info = i18n.I.text(i18n.K.resource_cache_info);
    logger.info(info, Array.from(this.m_cache_asset));
    // logger.info("cc.loader._cache:", cc.loader["_cache"]);
  }

  /**
   * 资源类型回退
   * @param types 类型列表
   */
  private _resTypeFallback(types: Array<string>): string {
    for (let i = 0; i < constants.RES_TYPE_FALLBACKS.length; i++) {
      let type = constants.RES_TYPE_FALLBACKS[i];
      if (types.indexOf(type) >= 0) {
        return type;
      }
    }
  }

  /**
   * 建立资源路径与类型的映射
   */
  private _linkPathAndType() {
    let assets = cc.loader["_assetTables"]["assets"]["_pathToUuid"];
    let _types = new Set();
    for (let path in assets) {
      let entries = [];
      let _entries = assets[path];
      _entries instanceof Array
        ? entries.push(..._entries)
        : entries.push(_entries);
      let types: Array<string> = [];
      entries.forEach(entry => {
        let classname = cc.js.getClassName(entry.type);
        constants.RES_TYPE_LIST.has(classname) && types.push(classname);
        _types.add(classname);
      });
      this.m_path_type.set(path, this._resTypeFallback(types));
    }
    logger.info(
      i18n.I.text(i18n.K.resources_type_in_cache),
      ...Array.from(_types)
    );
  }

  /**
   * 获得缓存中的资源
   * @param path 资源路径
   */
  private _get(path: string): interfaces.I_Res_Cache_Asset {
    return this.m_cache_asset.get(path);
  }

  /**
   * 获得内置资源列表
   */
  private _builtinDependUrls(): void {
    this.m_builtin_res = Object.keys(cc["AssetLibrary"]["getBuiltinDeps"]());
  }

  /**
   * 获得资源依赖
   * @param asset 资源
   */
  private _getAssetDependUrls(asset: cc.Asset): Array<string> {
    return cc.loader.getDependsRecursively(asset);
  }

  /**
   * 获得已缓存的所有资源的依赖
   */
  private _getCacheDependUrls(): Array<string> {
    let set = new Set<string>();
    this.m_cache_asset.forEach(asset_info => {
      this._getAssetDependUrls(asset_info.asset).forEach(url => {
        this.m_builtin_res.indexOf(url) === -1 && set.add(url);
      });
    });
    return Array.from(set);
  }

  /**
   * 获得场景资源依赖
   * @returns 资源依赖数组
   */
  private _getSceneDependUrls(scene?: cc.Scene): Array<string> {
    scene = scene || cc.director.getScene();
    if (scene["dependAssets"]) {
      return scene["dependAssets"]["filter"](
        (url: string) => this.m_builtin_res.indexOf(url) === -1
      );
    }
    return [];
  }

  /**
   * 获得cc.loader._cache中排除脚本资源的资源总数
   * 排除：js
   */
  private _getCCLoaderCacheCount(): interfaces.I_Res_Cache_Refer {
    let refers = 0;
    let excludes = 0;
    let cache = cc.loader["_cache"];
    for (let url in cache) {
      let res_type = cache[url].type;
      constants.RES_TYPE_IN_CACHE_TO_EXCLUDES.has(res_type)
        ? excludes++
        : refers++;
    }
    return { refers: refers, excludes: excludes };
  }
}

const res = Res.s_instance;

export { res };
