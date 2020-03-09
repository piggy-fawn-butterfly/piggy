import Koa from "koa";
import KoaWebsocket from "koa-websocket";
import { toData, fromMsg } from "./../common/Common";

/**
 * @file WssRouter
 * @description websocket wss 路由中间件
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
export async function WssRouter(
  ctx: KoaWebsocket.MiddlewareContext<any>,
  next: Koa.Next
) {
  //连接建立处理
  console.info("[connect] clients:", ctx.app.ws.server?.clients.size);

  //连接消息处理
  ctx.websocket.on("message", (message: Buffer) => {
    console.info(`[message] json: `, fromMsg(message));
    ctx.websocket.send(toData("socket_keep_alive", { alive: Date.now() }));
  });

  //连接关闭处理
  ctx.websocket.on("close", code => {
    console.log("[disconnect] code:", code);
    console.info("[disconnect] clients:", ctx.app.ws.server?.clients.size);
  });

  //连接错误处理
  ctx.websocket.on("error", err => {
    console.error(`[error] occurs: `, err);
    ctx.websocket.send(toData("socket_error_occurs", { err: "error occurs" }));
  });

  await next();
}
