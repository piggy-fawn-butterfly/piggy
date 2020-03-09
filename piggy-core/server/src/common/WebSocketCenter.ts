import Koa from "koa";
import KoaWebsocket from "koa-websocket";
import { is, toMsg } from "../common/Common";
import * as types from "../constant/Types";
import ws from "ws";

/**
 * @file WebSocketCenter
 * @description 操作中心
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
namespace WebSocketCenter {
  /**
   * 获得在线连接数
   * @param ctx 上下文环境
   */
  export function online(ctx: KoaWebsocket.MiddlewareContext<any>) {
    return ctx.app.ws.server?.clients.size || 0;
  }

  /**
   * 广播消息
   * @param ctx 上下文环境
   * @param message 消息内容
   */
  export function broadcast(
    ctx: KoaWebsocket.MiddlewareContext<any>,
    message: types.T_Wss_Message,
    excludes?: string[]
  ) {
    ctx.app.ws.server?.clients.forEach(socket => {
      let ok = excludes?.includes(socket.uuid);
      is(ok, [true, undefined]) && send(socket, message);
    });
  }

  /**
   * 发送给多个指定用户
   * @param ctx 上下文环境
   * @param message 消息内容
   * @package uuid uuid数组
   *  - uuid 为空，则发送给指定用户
   *  - uuid 为数组，则发送给多个用户
   */
  export function sendTo(
    ctx: KoaWebsocket.MiddlewareContext<any>,
    message: types.T_Wss_Message,
    uuid?: string[]
  ) {
    if (uuid instanceof Array) {
      ctx.app.ws.server?.clients.forEach(socket => {
        uuid.includes(socket.uuid) && send(socket, message);
      });
      return;
    }
    send(ctx.websocket, message);
  }

  /**
   * 发送消息
   * @param socket websocket
   * @param message 消息体
   */
  function send(socket: ws, message: types.T_Wss_Message) {
    socket.send(toMsg(message[0], message[1]));
  }
}

export default WebSocketCenter;
