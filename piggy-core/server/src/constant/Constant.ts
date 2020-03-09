/**
 * @file Constants
 * @description 常量
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

/**
 * 通用 API
 */
const GLOBAL_API = {};

/**
 * HTTP 特定 API
 */
const HTTP_API = {};

/**
 * HTTPS 特定 API
 */
const HTTPS_API = {};

/**
 * WebSocket WS 特定 API
 */
const WS_API = {};

/**
 * WebSocket WSS 特定 API
 */
const WSS_API = {
  SOCKET_KEEP_ALIVE: "socket_keep_alive",
  SOCKET_CONNECTED: "socket_connected",
  SOCKET_ERROR: "socket_error",
  SOCKET_BROADCAST: "socket_broadcast"
};

/**
 * API合并
 */
export const API = {
  HTTP: HTTP_API,
  HTTPS: HTTPS_API,
  WS: WS_API,
  WSS: WSS_API,
  GL: GLOBAL_API
};
