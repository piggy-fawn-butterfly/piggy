import { layerBase } from "./LayerBase";
import { canvasAdapter } from "./CanvasAdapter";
import { res } from "../Res";
import { logger } from "../Logger";
import { assets } from "../../Const/Assets";
import { enums } from "../../Const/Declare/Enums";
import { cocos } from "../../Utils/Cocos";

/**
 * 固定节点名称
 */
const NODE_NAME = Object.freeze({
  CANVAS: "Canvas",
  ROOT: "__root__",
  CAMERA: "Main Camera"
});

/**
 * 关闭时忽略的视图
 */
const EXCLUDING_LAYERS = Object.freeze([
  assets.Prefab_BackgroundLayer.toString()
]);

/**
 * 判断指定视图是否忽略关闭
 * @param path 视图路径
 */
function _isExcludeLayer(path: string) {
  return EXCLUDING_LAYERS.indexOf(path) > -1;
}

/**
 * @file Layers
 * @description 视图管理器
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
class Layers {
  public static s_instance: Layers = new Layers();
  private m_stack_layers: Map<string, cc.Node> = new Map();
  private m_root: cc.Node = null;

  /**
   * 是否有效的视图资源路径
   * @param path 视图资源路径
   * @description
   * - 视图必须以 `预制体 Prefab` 的形式存在
   * - 视图资源路径必须以 `Prefab` 开头， 以 `Layer` 结尾
   * - 视图必须挂载基类 `LayerBase`
   */
  private _isValidPath(path: string): boolean {
    return (
      path.startsWith("Prefab") &&
      path.endsWith("Layer") &&
      res.isTypeOf(path, "cc.Prefab")
    );
  }

  /**
   * 隐藏构造器
   * - 监听场景加载完成事件，场景加载完成后初始化UI根节点
   */
  private constructor() {
    this.m_stack_layers.clear();
    cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._init, this);
  }

  /**
   * 初始化UI根节点
   * @description root节点总是位于主摄像机之后
   */
  private _init() {
    //添加根节点
    let canvas = cc.find(NODE_NAME.CANVAS);
    if (!canvas) return;
    let root = cc.find(NODE_NAME.ROOT, canvas);
    cc.find(NODE_NAME.CAMERA, canvas).zIndex = -1;
    this.m_root = root || new cc.Node(NODE_NAME.ROOT);
    this.m_root.parent = this.m_root.parent || canvas;
    this.m_root.x = this.m_root.x !== 0 && 0;
    this.m_root.y = this.m_root.y !== 0 && 0;
    this.m_root.width = canvas.width;
    this.m_root.height = canvas.height;
    this.m_root.zIndex = -1;

    //添加 CanvasAdapter 组件
    cocos.getOrAddComponent(this.m_root, canvasAdapter).adaptToCanvas();

    //取消监听场景加载完成事件
    cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._init, this);
  }

  /**
   * 获取视图
   * @param path 资源路径
   */
  layerOf<T extends layerBase>(path: string): T {
    let node = this.get(path);
    if (!node) return null;
    return node.getComponent(cc.path.basename(path));
  }

  /**
   * 指定视图是否已打开
   * @param path 资源路径
   */
  public has(path: string): boolean {
    return this.m_stack_layers.has(path);
  }

  /**
   * 获得资源路径对应的视图节点
   * @param path 资源路径
   */
  public get(path: string): cc.Node {
    return this.m_stack_layers.get(path);
  }

  /**
   * 打开视图
   * @param path 资源路径
   */
  public async open(path: string) {
    return new Promise(resolve => {
      if (this.has(path)) {
        return resolve(logger.warn("打开视图失败，视图已打开", path));
      }
      if (!this._isValidPath(path)) {
        return resolve(logger.warn("打开视图失败，视图路径无效", path));
      }
      res.use(path).then(node => {
        let layer: layerBase = node.getComponent(layerBase);
        layer.setAssetPath(path);
        this.m_stack_layers.set(path, node);
        this.m_root.addChild(node);
        node.setPosition(0, 0);
        this._reorder();
        this.dump();
        resolve();
      });
    });
  }

  /**
   * 关闭视图
   * @param path 资源路径
   */
  public close(path: string) {
    if (!this._isValidPath(path))
      return logger.warn("关闭视图失败，视图路径无效", path);
    let node = this.m_stack_layers.get(path);
    if (!node) return logger.warn("关闭视图失败，视图不存在", path);
    this.m_stack_layers.delete(path);
    node.destroy();
    res.unUseThenUnload(path);
    this._reorder();
    this.dump();
  }

  /**
   * 关闭全部视图
   * @param useExclude 关闭时是否忽略特定视图
   */
  public closeAll(useExclude: boolean = true) {
    this.m_stack_layers.forEach((node, path) => {
      if (useExclude ? !_isExcludeLayer(path) : true) {
        this.m_stack_layers.delete(path);
        node.destroy();
        res.unUseThenUnload(path);
      }
    });
    this._reorder();
    this.dump();
  }

  /**
   * 显示/隐藏视图节点
   * @param path 视图节点
   * @param show 显示/隐藏
   */
  private _show(path: string, show: boolean) {
    let node = this.get(path);
    if (node && node.isValid && node.active === !show) {
      node.active = show;
      node.getComponent(layerBase).p_mount_background &&
        this._reorderBackground();
    }
  }

  /**
   * 隐藏视图节点
   * @param path 资源路径
   */
  hide(path: string) {
    this._show(path, false);
  }

  /**
   * 显示视图节点
   * @param path 资源路径
   */
  show(path: string) {
    this._show(path, true);
  }

  /**
   * 重排渲染层级
   */
  private _reorder() {
    this._reorderBasic();
    this._reorderDock();
    this._reorderBackground();
  }

  /**
   * 为所有视图重新排布层级
   * @param path
   */
  private _reorderBasic() {
    this.m_stack_layers.forEach((node: cc.Node) => {
      node.zIndex = node.getComponent(layerBase).getPredefinedZOrder();
    });
  }

  /**
   * 为Dock视图重新排布层级
   * @param path
   */
  private _reorderDock() {
    this.m_stack_layers.forEach((node: cc.Node) => {
      let layer = node.getComponent(layerBase);
      if (layer && layer.p_layer_type === enums.E_Layer_Type.Dock) {
        node.zIndex += layer.p_dock_type;
      }
    });
  }

  /**
   * 为背景视图重新排布层级
   * @summary 注意事项
   * - 要求对象视图必须开启`挂载背景`属性
   * - 要求对象视图必须处于`激活状态`
   * @param path
   */
  private _reorderBackground() {
    let layer = this.m_stack_layers.get(assets.Prefab_BackgroundLayer);
    if (!layer) return;
    let target_z_order = 0;
    this.m_stack_layers.forEach((node: cc.Node) => {
      let layer = node.getComponent(layerBase);
      if (layer.p_mount_background && node.isValid && node.active) {
        target_z_order = Math.max(node.zIndex, 0);
      }
    });
    layer.zIndex = target_z_order - 1;
  }

  /**
   * 输出视图数据
   */
  public dump() {
    logger.info("@视图数据", this.m_root.children);
  }
}

export const layers = Layers.s_instance;
