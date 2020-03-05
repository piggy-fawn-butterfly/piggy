import { layerBase } from "./LayerBase";
import { touchable } from "./Touchable";
import { constants } from "../../Const/Constant";
import { enums } from "../../Const/Declare/Enums";

const { ccclass, property } = cc._decorator;

/**
 * @file LoadingLayer
 * @description 资源加载视图
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
class LoadingLayer extends layerBase {
  @property({
    displayName: "视图类型",
    override: true,
    readonly: true,
    type: cc.Enum(enums.E_Layer_Type)
  })
  p_layer_type: enums.E_Layer_Type = enums.E_Layer_Type.Loading;

  @property({ displayName: "进度条", type: cc.ProgressBar })
  p_pro_bar: cc.ProgressBar = null;

  @property({ displayName: "进度提示", type: cc.Label })
  p_pro_tip: cc.Label = null;

  @property({ displayName: "进度数值", type: cc.Label })
  p_pro_val: cc.Label = null;

  onEnable() {
    super.onEnable();

    this.addEvent(
      constants.EVENT_NAME.ON_RESOURCES_LOADING,
      this._onLoading.bind(this)
    );

    this.addEvent(
      constants.EVENT_NAME.ON_RESOURCES_LOADED,
      this._onLoaded.bind(this)
    );
  }

  /**
   * 资源加载事件处理
   * @param event 资源加载中事件
   */
  private _onLoading(event: cc.Event.EventCustom) {
    if (this.node.opacity === 0) {
      this.node.getComponent(touchable).on();
      this.node.opacity = 255;
    }
    let { current, total, asset } = event.getUserData();
    this._refresh(current, total, asset);
  }

  /**
   * 资源加载完成事件处理
   * @param event 资源加载完成事件
   */
  private _onLoaded(event: cc.Event.EventCustom) {
    this.node.getComponent(touchable).off();
    let data = event.getUserData();
    this.node.opacity = 0;
  }

  /**
   * 设置当前进度
   * @param progress 当前进度
   */
  public _setProgress(progress: number, tip: string = "") {
    this.p_pro_bar && (this.p_pro_bar.progress = progress);
    this.p_pro_tip && (this.p_pro_tip.string = tip ? "正在加载 " + tip : "");
    this.p_pro_val &&
      (this.p_pro_val.string = `${(progress * 100).toFixed(1)}%`);
  }

  /**
   * 刷新进度
   * @param current 当前进度
   * @param total 总共进度
   * @param name 当前加载的资源
   */
  private _refresh(current: number, total: number, name: string) {
    this._setProgress(current / total, name);
  }
}

export { LoadingLayer as loadingLayer };
