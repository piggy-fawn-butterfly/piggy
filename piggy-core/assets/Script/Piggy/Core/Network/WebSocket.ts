import { logger } from "../Logger";
import { events } from "../Events";
import { constants } from "../../Const/Constant";
import { interfaces } from "../../Const/Declare/Interfaces";

/**
 * @file WebSocket
 * @description WebSocket网络模块
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
export class webSocket {
  //---------------属性---------------

  /**
   * 静态单例
   */
  private static s_instance: webSocket = null;

  /**
   * 心跳包定时器
   */
  private m_heart_beat_tid: any = null;

  /**
   * 上次消息到达时间
   */
  private m_last_arrive_at: number = 0;

  /**
   * websocket实例对象
   */
  private m_socket: WebSocket = null;

  /**
   * 服务器地址
   */
  private m_server_addr: string = null;

  /**
   * 重连定时器id
   */
  private m_reconnect_tid: any = null;

  /**
   * N秒后重连
   */
  private m_reconnect_after: number = constants.RECONNECT_WHEN_CONNECTING;

  //---------------公共方法---------------

  /**
   * 隐藏构造器
   */
  private constructor() {}

  /**
   * 获取静态单例
   */
  public static getInstance(): webSocket {
    return (webSocket.s_instance = webSocket.s_instance || new webSocket());
  }

  /**
   * 连接到服务器
   * @param server 服务器地址
   */
  public connect(server: string = constants.SERVER_URL.WEBSOCKET.DEV) {
    if (this.m_socket) return;
    this.m_last_arrive_at = Date.now();
    this.m_server_addr = server;
    this.m_socket = new WebSocket(this.m_server_addr);
    this.m_socket.onopen = this._onopen.bind(this);
    this.m_socket.onmessage = this._onmessage.bind(this);
    this.m_socket.onerror = this._onerror.bind(this);
    this.m_socket.onclose = this._onclose.bind(this);
    logger.info("@WS连接请求" + this.m_server_addr);

    //开启重连机制
    this._resetReconnect(constants.RECONNECT_WHEN_CONNECTING);
  }

  /**
   * 重连
   */
  public reconnect() {
    if (Date.now() - this.m_last_arrive_at >= this.m_reconnect_after) {
      this.disconnect();
      this.connect();
    }
  }

  /**
   * 与服务器断开连接
   */
  public disconnect(code: number = constants.WEBSOCKET_SELF_CLOSE_CODE) {
    logger.info("@WS连接断开" + this.m_server_addr);
    this.m_socket && this.m_socket.close(code);
    this._clean();
  }

  /**
   * 发送数据
   * @param data 数据
   */
  public send(data: interfaces.I_Socket_Data) {
    if (!this._isState(WebSocket.OPEN)) return this.connect();
    let msg = [JSON.stringify(data)];
    this.m_socket.send(new Blob(msg, { type: "application/json" }));
  }

  /**
   * WebSocket是否已关闭
   */
  public isClose(): boolean {
    return this._isState(WebSocket.CLOSED);
  }

  /**
   * WebSocket是否正在关闭
   */
  public isClosing(): boolean {
    return this._isState(WebSocket.CLOSING);
  }

  /**
   * WebSocket是否正在连接
   */
  public isConnecting(): boolean {
    return this._isState(WebSocket.CONNECTING);
  }

  /**
   * WebSocket是否已打开
   */
  public isOpen(): boolean {
    return this._isState(WebSocket.OPEN);
  }

  //---------------私有方法---------------
  /**
   * 检查WebSocket状态
   * @param state WebSocket状态
   */
  private _isState(state: number) {
    if (this.m_socket) return this.m_socket.readyState === state;
    logger.error("WS连接未创建" + this.m_server_addr);
    return false;
  }

  /**
   * 发送心跳包
   */
  private _sendHeartBeat() {
    this.send({
      type: constants.EVENT_NAME.ON_SOCKET_KEEP_ALIVE,
      msg: { alive: Date.now() }
    });
    logger.info("@WS连接心跳" + this.m_server_addr);
  }

  /**
   * 重置心跳
   */
  private _resetHeartBeat() {
    this.m_last_arrive_at = Date.now();
    clearTimeout(this.m_heart_beat_tid);
    this.m_heart_beat_tid = setTimeout(
      this._sendHeartBeat.bind(this),
      constants.HEART_BEAT_INTERVAL
    );
  }

  /**
   * 重置重连
   * @param after N秒后重连
   */
  private _resetReconnect(after: number) {
    this.m_reconnect_after = after;
    clearTimeout(this.m_reconnect_tid);
    this.m_reconnect_tid = setTimeout(this.reconnect.bind(this), after);
  }

  /**
   * 连接建立
   */
  private _onopen() {
    logger.info("@WS连接建立" + this.m_server_addr);
    this._resetHeartBeat();
  }

  /**
   * 处理接收到的消息
   * @param e 消息
   */
  private _onmessage(e: MessageEvent) {
    if (e && e.data instanceof Blob) {
      e["data"]["text"]().then((raw_data: string) => {
        try {
          let { type, msg } = JSON.parse(raw_data);
          logger.info("@WS消息打印", type, msg);
          if (type === constants.EVENT_NAME.ON_SOCKET_KEEP_ALIVE) {
            this._resetHeartBeat();
            this._resetReconnect(constants.RECONNECT_WHEN_DISCONNECT);
          } else {
            events.dispatch(type, msg);
          }
        } catch (err) {
          logger.error("@WS消息错误", raw_data, err);
        }
      });
    }
  }

  /**
   * 连接错误
   * @param e 消息
   */
  private _onerror(e: MessageEvent) {
    logger.error("@WS连接错误" + this.m_server_addr, e["code"]);
  }

  /**
   * 连接关闭
   * @param e 消息
   */
  private _onclose(e: MessageEvent) {
    let code = e["code"];
    logger.warn("@WS连接关闭" + this.m_server_addr, code);
    code === 1006 && this.reconnect();
  }

  /**
   * 清理
   */
  private _clean() {
    clearTimeout(this.m_heart_beat_tid);
    clearTimeout(this.m_reconnect_tid);
    this.m_heart_beat_tid = null;
    this.m_reconnect_tid = null;
    this.m_socket.onopen = null;
    this.m_socket.onclose = null;
    this.m_socket.onerror = null;
    this.m_socket.onmessage = null;
    this.m_socket && delete this.m_socket;
    this.m_socket = null;
  }
}
