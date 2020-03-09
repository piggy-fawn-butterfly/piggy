import Koa from "koa";
import KoaWebsocket from "koa-websocket";
import { WssRouter } from "../router/WssRouter";
import { CA, PORT } from "./../constant/Config";
import { cat, uuidV4 } from "../common/Common";

/**
 * @file App
 * @description 应用入口
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
class App {
  private static s_instance: App;
  public static getInstance(): App {
    return (this.s_instance = this.s_instance || new App());
  }
  private m_server: KoaWebsocket.App;
  private constructor() {
    //HTTPS服务器选项
    const server_options = {
      key: cat(CA.KEY),
      cert: cat(CA.CRT),
      passphrase: CA.PASS
    };
    //使用WebSocket代理
    this.m_server = KoaWebsocket(new Koa(), {}, server_options);
    this.m_server.listen(PORT.WSS);
    //路由分发处理
    this.m_server.ws.use(WssRouter);
  }
}

export const app = App.getInstance();
