import { constants } from "../Piggy/Const/Constant";
import { assets } from "../Piggy/Const/Assets";
import { logger } from "../Piggy/Core/Logger";
import { events } from "../Piggy/Core/Events";
import { sound } from "../Piggy/Core/Sound";
import { res } from "../Piggy/Core/Res";
import { app } from "../Piggy/Core/Component/App";
import { layers } from "../Piggy/Core/Component/Layers";
import { webSocket } from "../Piggy/Core/Network/WebSocket";
import { httpClient } from "../Piggy/Core/Network/HttpClient";
import { pool } from "../Piggy/Core/Pool";

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
  /**
   * 开始游戏
   */
  public async onStart(): Promise<void> {
    await this.loadRes();
  }

  /**
   * 注册事件
   */
  registerEventListener() {
    super.registerEventListener();
    events
      .getInstance()
      .on(
        constants.EVENT_NAME.ON_DISPATCH_UI_EVENT,
        this._onListenUIEvent,
        this
      );
  }

  /**
   * 注销事件
   */
  unregisterEventListener() {
    events
      .getInstance()
      .off(
        constants.EVENT_NAME.ON_DISPATCH_UI_EVENT,
        this._onListenUIEvent,
        this
      );
    super.unregisterEventListener();
  }

  /**
   * 监听UI事件
   * @param event UI事件
   */
  private _onListenUIEvent(event: cc.Event.EventCustom) {
    let data = event.getUserData();
    if (data.type === "click") {
      let http = httpClient.getInstance();
      // let ws = webSocket.getInstance();
      if (data.com.name.indexOf("LoginBtn") > -1) {
        // ws.connect(constants.SERVER_URL.WSS.BETA);
        // http.get("https://192.168.22.222");
        // this.enterFullScreen();
        if (this["ws"]) return;
        var ws = new WebSocket("ws://127.0.0.1:8360/ws");
        this["ws"] = ws;
        ws.onopen = function() {
          console.log("open...", ws);
          ws.onerror = function(evt) {
            console.log(evt);
          };
          ws.onmessage = function(data) {
            console.log(data);
          };
          ws.onclose = function() {
            delete this["ws"];
          };
        };
      } else if (data.com.name.indexOf("LogoutBtn") > -1) {
        this["ws"] &&
          this["ws"].send(
            JSON.stringify({
              event: "addUser",
              data: { username: "reyn", room: 1 }
            })
          );
        // ws.reconnect();
        // http.post("https://httpbin.org/post", { type: "post_http" });
        // this.exitFullScreen();
      }
    }
  }

  /**
   * 加载资源
   * @description
   * 1. 加载对象池
   * @example
   * ```js
   * await pool.getInstance().load([[assets.Prefab_CanvasAdapterLayer, 1]]);
   * await pool.getInstance().get(assets.Prefab_CanvasAdapterLayer).then(node => {
   *   // node && this.node.addChild(node);
   * });
   * ```
   */
  async loadRes() {
    //你可以在一开始就加载所有需要用到的资源
    //在加载进度回调中更新页面 Loading
    //你也可以在运行时加载指定的资源
    //这意味着注释下面这段代码并不会影响代码的运行
    let resources = [
      assets.Prefab_LoginLayer,
      assets.Sound_LoopingBgm1,
      assets.Sound_ButtonClick
    ];
    await res.getInstance().load(resources, (c, t) => {
      logger.info(`资源加载进度:${((c / t) * 100) | 0}%`);
    });

    //打开登录页
    await layers.getInstance().open(assets.Prefab_CanvasAdapterLayer);
    await layers.getInstance().open(assets.Prefab_LoginLayer);

    //播放背景音乐
    await sound.getInstance().play(assets.Sound_LoopingBgm1, true, true);
  }
}

export { GameEntry as gameEntry };
