import { cocos } from "../Utils/_Utils";
import { eventCenter } from "./EventCenter";
import { constants } from "../Const/_Const";

const { ccclass, requireComponent } = cc._decorator;

/**
 * @file CanvasAdapter
 * @description 屏幕适配方案：SHOW_ALL + 根据屏幕尺寸适配
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
@requireComponent(cc.Widget)
class CanvasAdapter extends cc.Component {
  onLoad() {
    this.adapt();
    eventCenter.on(constants.EVENT_NAME.ON_CANVAS_RESIZE, this.adapt, this);
  }

  onDisable() {
    eventCenter.off(constants.EVENT_NAME.ON_CANVAS_RESIZE, this.adapt, this);
  }

  adapt() {
    this.scheduleOnce(() => {
      this._adapt();
    }, 0);
  }

  _adapt() {
    let widget = this.node.getComponent(cc.Widget);
    widget.alignMode = cc.Widget.AlignMode.ONCE;

    // 执行尺寸适配
    let { anchorX, anchorY } = this.node;
    let real_size = cocos.getCanvasRealSize();
    if (
      widget.isAlignBottom &&
      widget.isAlignLeft &&
      widget.isAlignTop &&
      widget.isAlignRight
    ) {
      let nw = real_size.width - widget.left - widget.right;
      let nh = real_size.height - widget.top - widget.bottom;
      this.node.setContentSize(nw, nh);
    } else if (widget.isAlignBottom && widget.isAlignTop) {
      let nh = real_size.height - widget.top - widget.bottom;
      this.node.height = nh;
    } else if (widget.isAlignLeft && widget.isAlignRight) {
      let nw = real_size.width - widget.left - widget.right;
      this.node.width = nw;
    }

    // 执行位置适配
    let rw = real_size.width * 0.5;
    let rh = real_size.height * 0.5;
    let nw = this.node.width * (1 - anchorX);
    let nh = this.node.height * (1 - anchorY);
    if (widget.isAlignLeft && !widget.isAlignRight) {
      this.node.x = -rw + nw + widget.left;
    } else if (widget.isAlignRight && !widget.isAlignLeft) {
      widget.isAlignRight && (this.node.x = rw - nw - widget.right);
    }
    if (widget.isAlignBottom && widget.isAlignTop) {
      this.node.y = -rh + nh + widget.bottom;
    } else if (widget.isAlignTop && !widget.isAlignBottom) {
      this.node.y = rh - nh - widget.top;
    }
  }
}

export { CanvasAdapter as canvasAdapter };
