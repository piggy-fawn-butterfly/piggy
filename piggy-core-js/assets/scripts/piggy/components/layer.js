import ui_event from "./ui_event";
import touchable from "./touchable";
import { enums } from "../data/enums";

/**
 * @file layer
 * @class
 * @description UI层基类
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
let LayerBase = cc.Class({
  editor: {
    disallowMultiple: true,
    requireComponent: touchable
  },
  extends: cc.Component,
  statics: {
    EVENT_TYPE_LAYER_OPEN: "layer-open",
    EVENT_TYPE_LAYER_CLOSE: "layer-close"
  },
  properties: {
    p_layer_type: {
      displayName: "视图类型",
      type: enums.E_Layer_Type,
      default: enums.E_Layer_Type.Screen
    },
    p_dock_type: {
      displayName: "指定Dock挂载视图",
      default: enums.E_Layer_Type.Background,
      type: enums.E_Layer_Type,
      visible() {
        return this.p_layer_type === enums.E_Layer_Type.Dock;
      }
    },
    p_mount_background: {
      displayName: "挂载背景",
      default: false,
      visible() {
        return !this.isExcludeMountBackground(this.p_layer_type);
      }
    },
    p_local_order: {
      displayName: "微调层级",
      type: cc.Integer,
      default: 0,
      min: 0,
      visible() {
        return !this.isExcludeMountBackground(this.p_layer_type);
      }
    },
    p_ui_events: {
      displayName: "UI事件",
      type: [ui_event],
      default: [],
      readonly: true,
      visible() {
        return !this.isExcludeMountBackground(this.p_layer_type);
      }
    }
  },

  ctor() {
    /**
     * 事件列表
     * @type {Map<string, Function>}
     */
    this.m_events = new Map();
    this.m_asset_path = "";
    /**
     * 忽略挂载背景的视图
     */
    this.exclude_mount_background = [enums.E_Layer_Type.Background, enums.E_Layer_Type.Loading, enums.E_Layer_Type.MsgText, enums.E_Layer_Type.Debug];
  },

  resetInEditor() {
    piggy.cocos.getOrAddComponent(this.node, touchable);
  },

  /**
   * 判断目标视图是否忽略挂载背景的视图
   * @param {enums.E_Layer_Type} type
   */
  isExcludeMountBackground(type) {
    return this.exclude_mount_background.indexOf(type) > -1;
  },
  //-------------组件方法---------------

  /**
   * 首次加载
   */
  onLoad() {
    this.resetInEditor();
    this._checkUIEvents();
  },

  /**
   * 使能组件，向外界发送层级打开事件
   */
  onEnable() {
    this._dispatch(
      piggy.events.create(this.EVENT_TYPE_LAYER_OPEN, {
        path: piggy.cocos.pathOfNode(this.node),
        com: this
      })
    );
    this._registerAll();
    this.onEnter();
  },

  /**
   * 禁用组件，向外界发送层级关闭事件
   */
  onDisable() {
    this._dispatch(
      piggy.events.create(this.EVENT_TYPE_LAYER_CLOSE, {
        path: piggy.cocos.pathOfNode(this.node),
        com: this
      })
    );
    this._unregisterAll();
    this.delAllEvents();
    this.onExit();
  },

  /**
   * 销毁组件
   */
  onDestroy() {
    this.onCleanUp();
  },

  /**
   * 设置资源路径
   * @param {string} path 资源路径
   */
  setAssetPath(path) {
    this.m_asset_path = path;
  },

  /**
   * 获得资源路径
   */
  getAssetPath() {
    return this.m_asset_path;
  },

  /**
   * 检查并排除无效的UI事件
   */
  _checkUIEvents() {
    let nodes = new Set();
    let index = [];
    this.p_ui_events.forEach((event, i) => {
      nodes.has(event.node) ? index.push(i) : nodes.add(event.node);
    });
    for (let i = index.length - 1; i >= 0; i--) {
      this.p_ui_events.splice(i, 1);
    }
    index = nodes = null;
  },

  /**
   * 注册所有UI事件
   */
  _registerAll() {
    this.p_ui_events.forEach(event => {
      let type = this.getUiEventType(event.type);
      if (type && event.node && event.node.isValid) {
        this.register(event.node.getComponent(type));
      }
    });
  },

  /**
   * 注销所有UI事件
   */
  _unregisterAll() {
    this.p_ui_events.forEach(event => {
      let type = this.getUiEventType(event.type);
      if (type && event.node && event.node.isValid) {
        let com = event.node.getComponent(type);
        com && com.isValid && this.unregister(com);
      }
    });
  },

  /**
   * 分发UI事件
   * @param {cc.Event.EventCustom} event
   */
  _dispatch(event) {
    let data = event.getUserData();
    data["type"] = event.type;
    data["ui"] = piggy.cocos.pathOfNode(this.node);
    piggy.events.dispatch(piggy.constants.EVENT_NAME.ON_DISPATCH_UI_EVENT, data);
  },

  /**
   * 为组件注册UI事件
   * @param component 组件
   */
  register(component) {
    if (!component || !component.isValid) return;
    if (!component.node || !component.node.isValid) return;
    let apis = this.apisOfComponent(component);
    if (!apis) return;
    for (let i = 0; i < apis.length; i++) {
      let api = apis[i];
      let event = events.create(api, {
        path: piggy.cocos.pathOfNode(component.node),
        com: component
      });
      let call = () => {
        this._dispatch(event);
      };
      component.node.on(api, call, this);
    }
  },

  /**
   * 为组件注销UI事件
   * @param component 组件
   */
  unregister(component) {
    if (!component || !component.isValid) return;
    if (!component.node || !component.node.isValid) return;
    let apis = this.apisOfComponent(component);
    if (!apis) return;
    for (let i = 0; i < apis.length; i++) {
      component.node.off(apis[i]);
    }
  },

  /**
   * 获得UI事件类型
   * @param {piggy.constants.UI_EVENT_TYPE_NAME} type UI事件枚举
   */
  getUiEventType(type) {
    return piggy.constants.UI_EVENT_TYPE_NAME[type];
  },

  /**
   * 获得组件对应的方法列表
   * @param {cc.Component} component 组件
   * @returns {string[]}
   */
  apisOfComponent(component) {
    if (!component || !component.isValid) return [];
    return piggy.constants.UI_EVENT_TYPE[piggy.cocos.instanceOfComponent(component)] || [];
  },

  /**
   * 添加事件
   * @param {string} event_name 事件名称
   * @param {Function} callback 事件回调
   */
  addEvent(event_name, callback) {
    if (!callback) return;
    if (this.m_events.has(event_name)) return;
    this.m_events.set(event_name, callback);
    piggy.events.on(event_name, callback, this);
  },

  /**
   * 删除事件
   * @param event_name 事件名称
   */
  delEvent(event_name) {
    if (!this.m_events.has(event_name)) return;
    piggy.events.off(event_name, this.m_events.get(event_name), this);
    this.m_events.delete(event_name);
  },

  /**
   * 删除全部事件
   */
  delAllEvents() {
    this.m_events.clear();
    piggy.events.targetOff(this);
  },

  /**
   * 获得预定义的渲染层级
   */
  getPredefinedZOrder() {
    return this.p_layer_type + this.p_local_z;
  },

  /**
   * 视图关闭
   */
  onClose() {
    piggy.layers.close(this.m_asset_path);
  },

  onEnter() {},
  onExit() {},
  onCleanUp() {}
});

export { LayerBase as layer };
