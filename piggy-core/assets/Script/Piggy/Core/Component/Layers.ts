import { res } from "../Res";
import { canvasAdapter } from "./CanvasAdapter";

/**
 * 节点名称
 */
const NODE_NAME = Object.freeze({
  CANVAS: "Canvas",
  ROOT: "__root__",
  CAMERA: "Main Camera"
});

function _getComponent<T extends cc.Component>(
  node: cc.Node,
  com: { new (): T }
) {
  return node.getComponent(com) || node.addComponent(com);
}

/**
 * @file Layers
 * @description UI层管理器
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
    _getComponent(this.m_root, canvasAdapter).adaptToCanvas();

    //取消监听场景加载完成事件
    cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._init, this);
  }

  /**
   * 打开层
   * @param path 资源路径
   */
  public async open(path: string): Promise<void> {
    res.use(path).then(node => {
      if (!node) return;
      this.m_stack_layers.set(path, node);
      this.m_root.addChild(node);
      node.setPosition(0, 0);
    });
  }

  public close(path: string) {
    this.m_root;
  }
}

export const layers = Layers.s_instance;
