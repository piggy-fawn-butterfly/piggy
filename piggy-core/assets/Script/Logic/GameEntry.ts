/**
 * @file GameEntry
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

import { app } from "../Piggy/Core/App";

const { ccclass } = cc._decorator;

/**
 * @class GameEntry
 * @extends `piggy.core.app`
 * @summary 用户自定义的游戏入口
 */
@ccclass
class GameEntry extends app {
  onLoad() {
    super.onLoad();
  }
}

export { GameEntry };
