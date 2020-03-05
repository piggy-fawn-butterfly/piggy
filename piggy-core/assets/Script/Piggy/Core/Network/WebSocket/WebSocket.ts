import { events } from "../../Events";
import { timer } from "../../Timer";

/**
 * 测试服务器地址
 */
const SERVER_FOR_TEST = "wss://echo.websocket.org";

interface I_Message_Info {
  alive: number;
  [key: string]: any;
}
interface I_Data_Info {
  type: string;
  msg: I_Message_Info;
}

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
export class ws_socket {
  private static s_instance: ws_socket = null;
  public static getInstance(): ws_socket {
    return (ws_socket.s_instance = ws_socket.s_instance || new ws_socket());
  }
  /**
   * 心跳包定时器
   */
  private m_heart_beat_timer: timer = null;
  private m_heart_beat_at: number = Date.now();
  private readonly m_heart_beat_interval: number = 30;

  /**
   * websocket实例对象
   */
  private m_socket: WebSocket = null;

  /**
   * 服务器地址
   */
  private m_server_addr: string = null;

  /**
   * 连接到服务器
   * @param server 服务器地址
   */
  public connect(server: string = SERVER_FOR_TEST) {
    if (this.m_socket) return;
    this.m_server_addr = server;
    this.m_socket = new WebSocket(this.m_server_addr);
    this.m_socket.onopen = this._onopen.bind(this);
    this.m_socket.onmessage = this._onmessage.bind(this);
    this.m_socket.onerror = this._onerror.bind(this);
    this.m_socket.onclose = this._onclose.bind(this);
    this.m_heart_beat_timer = new timer(
      this._sendHeartBeat.bind(this),
      this.m_heart_beat_interval,
      0
    );
  }

  /**
   * 与服务器断开连接
   */
  disconnect() {
    if (!this.m_socket) return;
    this.m_heart_beat_timer.stop();
    this.m_socket.close();
    delete this.m_heart_beat_timer;
    delete this.m_socket;
    this.m_socket = null;
    this.m_heart_beat_timer = null;
  }

  /**
   * 与服务器重新建立连接
   */
  public reconnect() {
    // this.m_heart_flipped_timer.restart();
  }

  /**
   * 发送数据
   * @param data 数据
   */
  public send(data: I_Data_Info) {
    if (
      Object.prototype.hasOwnProperty.call(data, "type") &&
      Object.prototype.hasOwnProperty.call(data, "msg")
    ) {
      let msg = [JSON.stringify(data)];
      this.m_socket.send(new Blob(msg, { type: "application/json" }));
    }
  }

  /**
   * 发送心跳包
   */
  private _sendHeartBeat() {
    let now = Date.now();
    let diff = now - this.m_heart_beat_at;
    this.m_heart_beat_at = now;
    this.send({ type: "keep-alive", msg: { alive: diff } });
  }

  /**
   * 停止发送心跳包
   */
  private _stopHeartBeat() {
    this.m_heart_beat_timer.stop();
    delete this.m_heart_beat_timer;
    this.m_heart_beat_timer = null;
  }

  /**
   * 连接建立
   */
  private _onopen() {
    this.m_heart_beat_timer.start();
    this._sendHeartBeat();
  }

  /**
   * 接收消息
   * @param e 消息
   */
  private _onmessage(e: MessageEvent) {
    if (e.data instanceof Blob) {
      e["data"]["text"]().then((raw_data: string) => {
        try {
          let { type, msg } = JSON.parse(raw_data);
          console.log(type, msg);
          events.dispatch(type, msg);
        } catch (err) {
          console.log(err);
        }
      });
    }
  }

  /**
   * 连接错误
   * @param e 消息
   */
  private _onerror(e: MessageEvent) {}

  /**
   * 连接关闭
   * @param e 消息
   */
  private _onclose(e: MessageEvent) {
    this._stopHeartBeat();
  }
}
