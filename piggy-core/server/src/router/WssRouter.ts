import Koa from "koa";
import KoaWebsocket from "koa-websocket";
import WebSocketCenter from "../common/WebSocketCenter";
import { fromMsg, uuidV4 } from "./../common/Common";
import { API } from "../constant/Constant";
import { T_Wss_Message } from "../constant/Types";

function wrapper(
  ctx: KoaWebsocket.MiddlewareContext<any>,
  type: string,
  msg: object
): T_Wss_Message {
  let online = WebSocketCenter.online(ctx);
  let body = { online: online };
  Object.assign(body, msg);
  return [type, body];
}

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
  //为连接配置唯一标识
  const uuid = (ctx.websocket.uuid = uuidV4());

  //连接建立处理
  console.info("[connect] clients:", WebSocketCenter.online(ctx), uuid);
  let msg = wrapper(ctx, API.WSS.SOCKET_CONNECTED, { uuid: uuid });
  WebSocketCenter.broadcast(ctx, msg, [uuid]);

  //连接消息处理
  ctx.websocket.on("message", (message: Buffer) => {
    console.info(`[message] json: `, fromMsg(message));
    let msg = wrapper(ctx, API.WSS.SOCKET_KEEP_ALIVE, { uuid: uuid });
    WebSocketCenter.sendTo(ctx, msg);
  });

  //连接关闭处理
  ctx.websocket.on("close", code => {
    console.log("[disconnect] code:", code);
    console.info("[disconnect] clients:", WebSocketCenter.online(ctx));
    let msg = wrapper(ctx, API.WSS.SOCKET_BROADCAST, { offline: uuid });
    WebSocketCenter.broadcast(ctx, msg);
  });

  //连接错误处理
  ctx.websocket.on("error", err => {
    console.error(`[error] occurs: `, err);
    let msg = wrapper(ctx, API.WSS.SOCKET_ERROR, { err: "error occurs" });
    WebSocketCenter.sendTo(ctx, msg);
  });

  await next();
}
