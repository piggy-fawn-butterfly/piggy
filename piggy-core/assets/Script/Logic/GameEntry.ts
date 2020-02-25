import { app } from "../Piggy/Core/App";
import { assetPath } from "../Piggy/Const/AssetPath";
import { res } from "../Piggy/Core/Res";
const { ccclass } = cc._decorator;

/**
 * @file GameEntry
 * @class
 * @extends `piggy.core.app`
 * @description 用户自定义的游戏入口，需要继承自 `Piggy.Core.App`
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
class GameEntry extends app {
  onLoad() {
    super.onLoad();
    this.loadRes();
  }

  /**
   * 加载资源
   */
  async loadRes() {
    res.initialize();
    let node = await res.use(assetPath.Prefab_Testcase_CanvasAdapter);
    node && this.node.addChild(node);
  }
}

export { GameEntry };
