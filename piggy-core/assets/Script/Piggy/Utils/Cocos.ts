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

/**
 * 根据路径和参考节点获取节点
 * @param path 节点相对路径
 * @param referenceNode 参考节点
 */
export function findNode(path: string, referenceNode?: cc.Node): cc.Node {
  return cc.find(path, referenceNode);
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
  return cc.find(path, referenceNode).getComponent(component);
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
  return cc.find(path, referenceNode).getComponent(component);
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
