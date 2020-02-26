import { app } from "../Piggy/Core/App";
import { pool } from "../Piggy/Core/Pool";
import { assetPath } from "../Piggy/Const/AssetPath";
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
    await pool.load([[assetPath.Prefab_Testcase_CanvasAdapter, 1]]);
    await pool.get(assetPath.Prefab_Testcase_CanvasAdapter).then(node => {
      node && this.node.addChild(node);
    });
    pool.dump();
  }
}

export { GameEntry as gameEntry };
