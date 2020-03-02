import { events } from "../Events";
import { cocos } from "../../Utils/Cocos";
import { canvasAdapter } from "./CanvasAdapter";
import { constants } from "../../Const/Constant";

const { ccclass, property, disallowMultiple, requireComponent } = cc._decorator;

/**
 * @class
 * @description UI事件构成类
 */
@ccclass("ui_event")
class UIEvent {
  @property({ type: cc.Node })
  node: cc.Node = null;

  @property({ type: cc.Enum(constants.UI_EVENT_TYPE_NAME) })
  type = constants.UI_EVENT_TYPE_NAME.Touchable;
}

/**
 * @file LayerBase
 * @description UI层基类
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
@ccclass
@disallowMultiple
@requireComponent(canvasAdapter)
abstract class LayerBase extends cc.Component {
  public static readonly EVENT_TYPE_LAYER_OPEN: string = "layer-open";
  public static readonly EVENT_TYPE_LAYER_CLOSE: string = "layer-close";

  @property({ displayName: "UI事件", type: [UIEvent], readonly: true })
  p_ui_events: UIEvent[] = [];

  /**
   * 首次加载
   */
  onLoad() {
    this._checkUIEvents();
  }

  /**
   * 使能组件，向外界发送层级打开事件
   */
  onEnable() {
    this._dispatch(
      events.create(LayerBase.EVENT_TYPE_LAYER_OPEN, {
        path: cocos.pathOfNode(this.node),
        com: this
      })
    );
    this._registerAll();
    this.onEnter();
  }

  /**
   * 禁用组件，向外界发送层级关闭事件
   */
  onDisable() {
    this._dispatch(
      events.create(LayerBase.EVENT_TYPE_LAYER_CLOSE, {
        path: cocos.pathOfNode(this.node),
        com: this
      })
    );
    this._unregisterAll();
    this.onExit();
  }

  /**
   * 销毁组件
   */
  onDestroy() {
    this.onCleanUp();
  }

  /**
   * 检查并排除无效的UI事件
   */
  private _checkUIEvents() {
    let nodes = new Set();
    let index = [];
    this.p_ui_events.forEach((event: UIEvent, i: number) => {
      nodes.has(event.node) ? index.push(i) : nodes.add(event.node);
    });
    for (let i = index.length - 1; i >= 0; i--) {
      this.p_ui_events.splice(i, 1);
    }
    index = nodes = null;
  }

  /**
   * 注册所有UI事件
   */
  private _registerAll() {
    this.p_ui_events.forEach((event: UIEvent) => {
      let type = this.getUiEventType(event.type);
      if (type && event.node && event.node.isValid) {
        this.register(event.node.getComponent(type));
      }
    });
  }

  /**
   * 注销所有UI事件
   */
  private _unregisterAll() {
    this.p_ui_events.forEach((event: UIEvent) => {
      let type = this.getUiEventType(event.type);
      if (type && event.node && event.node.isValid) {
        let com = event.node.getComponent(type);
        com && com.isValid && this.unregister(com);
      }
    });
  }

  /**
   * 分发UI事件
   * @param event
   */
  private _dispatch(event: cc.Event.EventCustom) {
    let data = event.getUserData();
    data["type"] = event.type;
    data["ui"] = cocos.pathOfNode(this.node);
    events.dispatch(constants.EVENT_NAME.ON_DISPATCH_UI_EVENT, data);
  }

  /**
   * 为组件注册UI事件
   * @param component 组件
   */
  public register<T extends cc.Component>(component: T) {
    if (!component || !component.isValid) return;
    if (!component.node || !component.node.isValid) return;
    let apis = this.apisOfComponent(component);
    if (!apis) return;
    for (let i = 0; i < apis.length; i++) {
      let api = apis[i];
      let event = events.create(api, {
        path: cocos.pathOfNode(component.node),
        com: component
      });
      let call = () => {
        this._dispatch(event);
      };
      component.node.on(api, call, this);
    }
  }

  /**
   * 为组件注销UI事件
   * @param component 组件
   */
  public unregister<T extends cc.Component>(component: T) {
    if (!component || !component.isValid) return;
    if (!component.node || !component.node.isValid) return;
    let apis = this.apisOfComponent(component);
    if (!apis) return;
    for (let i = 0; i < apis.length; i++) {
      component.node.off(apis[i]);
    }
  }

  /**
   * 获得UI事件类型
   * @param type UI事件枚举
   */
  public getUiEventType(type: constants.UI_EVENT_TYPE_NAME) {
    return constants.UI_EVENT_TYPE_NAME[type];
  }

  /**
   * 获得组件对应的方法列表
   * @param component 组件
   */
  public apisOfComponent<T extends cc.Component>(component: T): string[] {
    if (!component || !component.isValid) return [];
    return constants.UI_EVENT_TYPE[cocos.instanceOfComponent(component)] || [];
  }

  public onEnter(): void {}
  public onExit(): void {}
  public onCleanUp(): void {}
}

export { LayerBase as layerBase };
