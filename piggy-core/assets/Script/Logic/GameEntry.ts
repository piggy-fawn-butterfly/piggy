import { res } from "../Piggy/Core/Res";
import { pool } from "../Piggy/Core/Pool";
import { sound } from "../Piggy/Core/Sound";
import { logger } from "../Piggy/Core/Logger";
import { assets } from "../Piggy/Const/Assets";
import { app } from "../Piggy/Core/Component/App";

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
  public async onStart(): Promise<void> {
    await this.loadRes();
  }

  /**
   * 加载资源
   */
  async loadRes() {
    //你可以在一开始就加载所有需要用到的资源
    //在加载进度回调中更新页面 Loading
    //你也可以在运行时加载指定的资源
    //这意味着注释下面这段代码并不会影响代码的运行
    let resources = [
      assets.Prefab_Testcase_CanvasAdapter,
      assets.Sound_LoopingBgm1,
      assets.Sound_ButtonClick
    ];
    await res.load(resources, (c, t) => {
      logger.info(`资源加载进度:${((c / t) * 100) | 0}%`);
    });

    //加载对象池
    await pool.load([[assets.Prefab_Testcase_CanvasAdapter, 1]]);
    await pool.get(assets.Prefab_Testcase_CanvasAdapter).then(node => {
      node && this.node.addChild(node);
    });

    //播放背景音乐
    await sound.play(assets.Sound_LoopingBgm1, true, true);
  }
}

export { GameEntry as gameEntry };
