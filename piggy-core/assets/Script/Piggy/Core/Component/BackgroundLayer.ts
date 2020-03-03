import { layerBase } from "./LayerBase";
import { enums } from "../../Const/Declare/Enums";
import { canvasAdapter } from "./CanvasAdapter";
import { touchable } from "./Touchable";

const { ccclass, property, requireComponent } = cc._decorator;

/**
 * @file BackgroundLayer
 * @description 背景层
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
@requireComponent(canvasAdapter)
class BackgroundLayer extends layerBase {
  @property({
    displayName: "视图类型",
    override: true,
    readonly: true,
    type: cc.Enum(enums.E_Layer_Type)
  })
  p_layer_type: enums.E_Layer_Type = enums.E_Layer_Type.Background;

  resetInEditor() {
    this.node.getComponent(canvasAdapter).adaptToCanvas();
  }

  /**
   * 启用/禁用监听
   * @param enabled 启用/禁用
   */
  private _enableTouchUpInListener(enabled: boolean) {
    let cf = enabled ? this.onUpIn.bind(this) : null;
    this.node.getComponent(touchable).setUpInCallback(cf);
  }

  /**
   * 启用组件
   */
  onEnable() {
    super.onEnable();
    this._enableTouchUpInListener(true);
  }

  /**
   * 禁用组件
   */
  onDisable() {
    super.onDisable();
    this._enableTouchUpInListener(false);
  }

  /**
   * 点击到背景层
   */
  onUpIn() {
    //TODO
  }

  /**
   * 设置透明度
   * @param percent 透明度百分比
   */
  setTransparent(percent: number) {
    percent = Math.max(0, Math.min(1, percent));
    this.node.opacity = percent * 255;
  }
}

export { BackgroundLayer as backgroundLayer };
