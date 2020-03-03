import { layerBase } from "../Piggy/Core/Component/LayerBase";
import { constants } from "../Piggy/Const/Constant";

const { ccclass } = cc._decorator;

/**
 * @file LoginLayer
 * @class
 * @description 登录层
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
class LoginLayer extends layerBase {
  onLoad() {
    super.onLoad();

    this.addEvent(
      constants.EVENT_NAME.ON_DISPATCH_UI_EVENT,
      (event: cc.Event.EventCustom) => {
        let data = event.getUserData();
        console.log(data.type);
      }
    );
  }

  onEnter() {}
  onExit() {}
}

export { LoginLayer as loginLayer };
