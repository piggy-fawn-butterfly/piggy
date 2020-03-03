import { layerBase } from "./LayerBase";
import { canvasAdapter } from "./CanvasAdapter";
import { res } from "../Res";
import { logger } from "../Logger";
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
 * @file Layers
 * @description UI层管理器: **约定**
 * - 层名称以 `Layer` 结尾
 * - 层必须挂载基类 `LayerBase`
 * - 层以 `预制体 Prefab` 的形式存在
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
   * 打开层
   * @param path 资源路径
   */
  public async open(path: string): Promise<void> {
    if (!path.endsWith("Layer")) return;
    res.use(path).then(node => {
      if (!node) return;
      let layer: layerBase = node.getComponent(layerBase);
      if (!layer) {
        res.unUse(path);
        res.unload(path);
        return;
      }
      this.m_stack_layers.set(path, node);
      this.m_root.addChild(node, layer.getPredefinedZOrder());
      node.setPosition(0, 0);
      this._reorder();
      this.dump();
    });
  }

  /**
   * 关闭层
   * @param path 资源路径
   */
  public close(path: string) {
    if (!path.endsWith("Layer")) return;
    if (this.m_stack_layers.has(path)) {
      this.m_stack_layers.get(path).removeFromParent(true);
      this._reorder();
      this.dump();
    }
  }

  /**
   * 重排渲染层级
   */
  private _reorder() {}

  /**
   * 输出视图数据
   */
  public dump() {
    logger.info("@视图数据", this.m_root.children);
  }
}

export const layers = Layers.s_instance;
