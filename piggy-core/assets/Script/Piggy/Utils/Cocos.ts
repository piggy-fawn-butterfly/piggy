/**
 * @file Cocos
 * @description Cocos辅助方法扩展
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
namespace cocos {
  /**
   * 根据路径和参考节点获取节点
   * @param path 节点相对路径
   * @param referenceNode 参考节点
   */
  export function findNode(path: string, referenceNode?: cc.Node): cc.Node {
    return cc.find(path, referenceNode);
  }

  /**
   * 根据路径和参考节点获取节点
   * @param path 节点相对路径
   * @param referenceNode 参考节点
   */
  export function findNodes(path: string, referenceNode?: cc.Node): cc.Node[] {
    let match = [];
    if (path == null) return match;
    if (referenceNode && !referenceNode.isValid) return match;
    if (!referenceNode) {
      let scene = cc.director.getScene();
      if (!scene) return match;
      if (!scene.isValid) return match;
      referenceNode = scene;
    }
    let startIndex = path[0] !== "/" ? 0 : 1;
    let nameList = path.split("/");
    for (let n = startIndex; n < nameList.length; n++) {
      let name = nameList[n];
      let children = referenceNode["_children"];
      for (let t = 0, len = children.length; t < len; ++t) {
        let subChild = children[t];
        subChild.name === name && match.push(subChild);
      }
    }

    return match;
  }

  /**
   * 根据路径和参考节点和组件类型获取节点下的组件
   * @param path 节点相对路径
   * @param component 组件类型
   * @param referenceNode 参考节点
   */
  export function findComponent<T extends cc.Component>(
    path: string,
    component: { prototype: T },
    referenceNode?: cc.Node
  ) {
    let node = cc.find(path, referenceNode);
    if (!node) return null;
    return node.getComponent(component);
  }

  /**
   * 根据路径和参考节点和组件名称获取节点下的组件
   * @param path 节点相对路径
   * @param component 组件名称
   * @param referenceNode 参考节点
   */
  export function findComponentByName(
    path: string,
    component: string,
    referenceNode?: cc.Node
  ): cc.Component {
    let node = cc.find(path, referenceNode);
    if (!node) return null;
    return node.getComponent(component);
  }

  /**
   * 自动获取目标节点上的组件，如果找不到组件则自动挂载组件到目标节点
   * @param node 目标节点
   * @param component 目标组件
   */
  export function getOrAddComponent<T extends cc.Component>(
    node: cc.Node,
    component: { new (): T }
  ) {
    return node.getComponent(component) || node.addComponent(component);
  }

  /**
   * 获得组件类型
   * @param component 组件
   */
  export function instanceOfComponent<T extends cc.Component>(
    component: T
  ): string {
    if (component && component.isValid) {
      return component["__proto__"]["__classname__"];
    }
    return "undefined";
  }

  /**
   * 获得组件路径
   * @param component 组件
   */
  export function pathOfNode(
    target: cc.Node,
    root: cc.Node = null,
    full: boolean = true
  ): string {
    if (!root) root = cc.find("Canvas");
    let walk = (from: cc.Node, url: string[]) => {
      url.push(from.parent.name);
      from.parent !== root && walk(from.parent, url);
    };
    let path = [];
    walk(target, path);
    !full && path.pop();
    path.unshift(target.name);
    return path.reverse().join("/");
  }

  /**
   * 是否触发按钮点击事件
   * @param e 按钮点击事件
   * @param sound 是否触发点击音效
   * @returns 是否触发按钮点击事件
   */
  export function onClickEvent(e: cc.Event): boolean {
    if (e) {
      let target = null;
      if (e.target) {
        target = e.target;
        e.stopPropagation();
      } else {
        target = e;
      }

      if (target && !isButtonAvailable(target)) {
        return false;
      }
    }
  }

  /**
   *
   * @param node 按钮节点
   * @param tip
   */
  export function isButtonAvailable(node: cc.Node, tip: boolean = false) {
    let button = node.getComponent("Button");
    let available = true;
    button && (available = button.available()) && button.click();
    return available;
  }

  /**
   * 获得节点的世界坐标
   * @param node 目标节点
   * @returns point 世界坐标
   */
  export function getWorldPosition(node: cc.Node): cc.Vec2 {
    return node.parent.convertToWorldSpaceAR(node.position);
  }

  /**
   * 精灵置灰/解除置灰
   * TODO 原方法会报错，需要同步最新的方案
   * @param sprite 精灵
   * @param gray 是否置灰
   */
  export function setGray(sprite: cc.Sprite, gray: boolean = true) {
    let builtin = gray ? "2d-gray-sprite" : "2d-sprite";
    let material = cc.Material["getBuiltinMaterial"](builtin);
    material = cc.Material["getInstantiatedMaterial"](material, sprite);
    sprite.setMaterial(0, material);
  }

  /**
   * 停止所有动作
   * @param node 目标节点
   */
  export function stopNode(node: cc.Node) {
    node.stopAllActions();
    node.children.forEach(v => {
      stopNode(v);
    });
  }

  /**
   * 暂停所有动作
   * @param node 目标节点
   */
  export function pauseNode(node: cc.Node) {
    node.stopAllActions();
    node.children.forEach(v => {
      pauseNode(v);
    });
  }

  /**
   * 恢复所有动作
   * @param node 目标节点
   */
  export function resumeNode(node: cc.Node) {
    node.stopAllActions();
    node.children.forEach(v => {
      resumeNode(v);
    });
  }

  /**
   * 获得真实窗口尺寸
   */
  export function getCanvasRealSize(): cc.Size {
    let fs = cc.view.getFrameSize();
    let sc = cc.view.getDevicePixelRatio();
    let scx = cc.view.getScaleX();
    let scy = cc.view.getScaleY();
    let width = Math.ceil((fs.width / scx) * sc);
    let height = Math.ceil((fs.height / scy) * sc);
    return cc.size(width, height);
  }

  /**
   * 设置贴图是否抗锯齿
   * @param tex 贴图
   * @param enabled 是否开启抗锯齿
   * @since 2.3.0
   */
  export function enableAntiAtlases(tex: cc.Texture2D, enabled: boolean) {
    const { LINEAR, NEAREST } = cc.Texture2D.Filter;
    let filter = enabled ? LINEAR : NEAREST;
    tex && tex.setFilters(filter, filter);
  }
}

export { cocos };
