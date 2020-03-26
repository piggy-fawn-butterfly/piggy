import screen_adapter from "../components/screenAdapter";

/**
 * @file layers
 * @description 视图管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class layers {
  /**
   * 隐藏构造器
   * - 监听场景加载完成事件，场景加载完成后初始化UI根节点
   */
  constructor() {
    /**
     * @type {Map<string, cc.Node>}
     */
    this.m_stack_layers = new Map();

    /**
     * @type {cc.Node}
     */
    this.m_root = null;

    /**
     * 固定节点名称
     */
    this.base_node_names = {
      canvas: "Canvas",
      camera: "Main Camera",
      root: "root"
    };

    /**
     * 关闭时忽略的视图
     */
    this.excluding_layers = [piggy.assets.Prefab_BackgroundLayer, piggy.assets.Prefab_LoadingLayer];
  }

  /**
   * 判断指定视图是否忽略关闭
   * @param {string} path 视图路径
   * @returns {boolean}
   */
  _isExcludeLayer(path) {
    return this.excluding_layers.indexOf(path) > -1;
  }

  /**
   * 是否有效的视图资源路径
   * @description
   * - 视图必须以 `预制体 Prefab` 的形式存在
   * - 视图资源路径必须以 `Prefab` 开头， 以 `Layer` 结尾
   * - 视图必须挂载基类 `LayerBase`
   * @param {string} path 视图资源路径
   * @returns {boolean}
   */
  _isValidPath(path) {
    return path.startsWith("Prefab") && path.endsWith("Layer") && piggy.res.isTypeOf(path, "cc.Prefab");
  }

  /**
   * 初始化UI根节点
   * @description
   * - 添加根节点和 `screen_adapter` 组件
   * - 层级关系：
   *  - `Canvas`
   *    - `Main Camera`
   *    - `root`
   */
  init() {
    let canvas = cc.find(this.base_node_names.canvas);
    cc.find(this.base_node_names.camera, canvas).zIndex = -1;
    let root = canvas.getChildByName(this.base_node_names.root);
    if (!root) {
      root = new cc.Node(this.base_node_names.root);
      root.parent = canvas;
    }
    root.zIndex = -1;
    root.setPosition(0, 0);
    this.m_root = root;
    piggy.cocos.getOrAddComponent(canvas, screen_adapter).adaptToCanvas();
  }

  /**
   * 获取视图
   * @param {string} path 资源路径
   * @returns {cc.Component} 视图层组件
   */
  layerOf(path) {
    let node = this.get(path);
    if (!node) return null;
    return node.getComponent(cc.path.basename(path));
  }

  /**
   * 指定视图是否已打开
   * @param {string} path 资源路径
   * @returns {boolean}
   */
  has(path) {
    return this.m_stack_layers.has(path);
  }

  /**
   * 获得资源路径对应的视图节点
   * @param {string} path 资源路径
   * @returns {cc.Node} 视图层节点
   */
  get(path) {
    return this.m_stack_layers.get(path);
  }

  /**
   * 打开视图
   * @param {string} path 资源路径
   */
  open(path) {
    if (this.has(path)) return piggy.logger.warn("打开视图失败，视图已打开", path);
    if (!this._isValidPath(path)) return piggy.logger.warn("打开视图失败，视图路径无效", path);
    let node = piggy.res.use(path);
    let view = node.getComponent("layer");
    view.setAssetPath(path);
    this.m_stack_layers.set(path, node);
    this.m_root.addChild(node);
    node.setPosition(0, 0);
    this._reorder();
    this.dump();
  }

  /**
   * 关闭视图
   * @param {string} path 资源路径
   */
  close(path) {
    if (!this._isValidPath(path)) return piggy.logger.warn("关闭视图失败，视图路径无效", path);
    let node = this.m_stack_layers.get(path);
    if (!node) return piggy.logger.warn("关闭视图失败，视图不存在", path);
    this.m_stack_layers.delete(path);
    node.destroy();
    piggy.res.unUseThenUnload(path);
    this._reorder();
    this.dump();
  }

  /**
   * 关闭全部视图
   * @param {boolean} useExclude 关闭时是否忽略特定视图
   */
  closeAll(useExclude = true) {
    this.m_stack_layers.forEach((node, path) => {
      if (useExclude ? !this._isExcludeLayer(path) : true) {
        this.m_stack_layers.delete(path);
        node.destroy();
        piggy.res.unUseThenUnload(path);
      }
    });
    this._reorder();
    this.dump();
  }

  /**
   * 显示/隐藏视图节点
   * @param {string} path 视图节点
   * @param {boolean} show 显示/隐藏
   */
  _show(path, show) {
    let node = this.get(path);
    if (node && node.isValid && node.active === !show) {
      node.active = show;
      node.getComponent("layer").p_mount_background && this._reorderBackground();
    }
  }

  /**
   * 隐藏视图节点
   * @param {string} path 资源路径
   */
  hide(path) {
    this._show(path, false);
  }

  /**
   * 显示视图节点
   * @param {string} path 资源路径
   */
  show(path) {
    this._show(path, true);
  }

  /**
   * 重排渲染层级
   */
  _reorder() {
    this._reorderBasic();
    this._reorderDock();
    this._reorderBackground();
  }

  /**
   * 为所有视图重新排布层级
   * @param {string} path
   */
  _reorderBasic() {
    this.m_stack_layers.forEach(node => {
      node.zIndex = node.getComponent("layer").getPredefinedZOrder();
    });
  }

  /**
   * 为Dock视图重新排布层级
   * @param {string} path
   */
  _reorderDock() {
    this.m_stack_layers.forEach(node => {
      let view = node.getComponent("layer");
      if (view && view.p_layer_type === piggy.enums.E_Layer_Type.Dock) {
        node.zIndex += view.p_dock_type;
      }
    });
  }

  /**
   * 为背景视图重新排布层级
   * @summary 注意事项
   * - 要求对象视图必须开启`挂载背景`属性
   * - 要求对象视图必须处于`激活状态`
   * @param {string} path
   */
  _reorderBackground() {
    if (!this.m_stack_layers.has(piggy.assets.Prefab_BackgroundLayer)) return;
    let target_z_order;
    this.m_stack_layers.forEach(node => {
      let view = node.getComponent("layer");
      if (view.p_mount_background && node.isValid && node.active) {
        target_z_order = Math.max(node.zIndex, 0);
      }
    });
    view.zIndex = target_z_order - 1;
  }

  /**
   * 输出视图数据
   */
  dump() {
    piggy.logger.info("@视图数据", this.m_root.children);
  }
}
