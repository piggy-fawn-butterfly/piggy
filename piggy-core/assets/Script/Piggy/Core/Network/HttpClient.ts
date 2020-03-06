import { logger } from "../Logger";
import { events } from "../Events";
import { ids } from "../IdGenerator";
import { constants } from "../../Const/Constant";
import { enums } from "../../Const/Declare/Enums";
import { interfaces } from "../../Const/Declare/Interfaces";

/**
 * @file HttpClient
 * @description HTTP网络模块
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
export class httpClient {
  public static s_instance: httpClient = new httpClient();
  private m_requests: Map<string, string> = new Map();

  /**
   * 获取静态单例
   */
  public static getInstance(): httpClient {
    return (httpClient.s_instance = httpClient.s_instance || new httpClient());
  }

  /**
   * 隐藏构造器
   */
  private constructor() {}

  /**
   * 构造请求参数
   * @param params 参数
   */
  private _getQueryString(params: interfaces.I_Simple_Object) {
    let keys = Object.keys(params);
    let walk = (key: string) => {
      return `${key}=${params[key]}`;
    };
    return Array.prototype.map.call(keys, walk).join("&");
  }

  /**
   * 设置HTTP请求头
   * @param xhr XMLHttpRequest
   * @param headers HTTP请求头
   */
  private _setRequestHeader(
    xhr: XMLHttpRequest,
    headers: interfaces.I_Simple_Object
  ) {
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  /**
   * 移除HTTP实例事件监听
   * @param xhr XMLHttpRequest
   */
  private _removeRequestEvent(xhr: XMLHttpRequest) {
    xhr.onload = xhr.onloadstart = xhr.onloadend = xhr.onprogress = null;
    xhr.ontimeout = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
    this.m_requests.delete(xhr["http_request_id"]);
    this.dump();
  }

  /**
   * 请求超时
   * @param xhr
   */
  private _onTimeout(xhr: XMLHttpRequest, url: string) {
    logger.warn("@HTTP请求超时", url, xhr);
    this._removeRequestEvent(xhr);
  }

  /**
   * 请求错误
   * @param xhr
   */
  private _onError(xhr: XMLHttpRequest, url: string) {
    logger.error("@HTTP请求错误", url, xhr);
    this._removeRequestEvent(xhr);
  }

  /**
   * 请求终止
   * @param xhr
   */
  private _onAbort(xhr: XMLHttpRequest, url: string) {
    logger.error("@HTTP请求终止", url, xhr);
    this._removeRequestEvent(xhr);
  }

  /**
   * 请求状态变化
   * @param xhr
   */
  private _onChange(xhr: XMLHttpRequest, url: string) {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
      try {
        const rep = JSON.parse(xhr.responseText);
        rep && rep.type && events.dispatch(rep.type, rep.msg);
        logger.info("@HTTP消息内容", url, rep);
      } catch (err) {
        logger.error("@HTTP消息错误", url, err, xhr);
      }
      this._removeRequestEvent(xhr);
    }
  }

  /**
   * 发送HTTP请求
   * @param method HTTP方法
   * @param url 地址
   * @param params 参数
   * @param headers HTTP请求头
   */
  private _send(
    method: enums.E_Http_Method,
    url: string,
    params: interfaces.I_Simple_Object,
    headers?: interfaces.I_Simple_Object
  ) {
    let xhr = cc.loader.getXMLHttpRequest();

    //设置请求头
    headers = headers || {};
    cc.sys.isNative && (headers["Accept-Encoding"] = "gzip,deflate");
    this._setRequestHeader(xhr, headers);

    //构造请求ID
    xhr["http_request_id"] = ids.http.next();
    this.m_requests.set(xhr["http_request_id"], url);

    //构造请求体
    let body = params instanceof Object ? JSON.stringify(params) : "";

    //监听事件
    xhr.onreadystatechange = this._onChange.bind(this, xhr, url);
    xhr.ontimeout = this._onTimeout.bind(this, xhr, url);
    xhr.onerror = this._onError.bind(this, xhr, url);
    xhr.onabort = this._onAbort.bind(this, xhr, url);

    //发送请求
    xhr.timeout = constants.HTTP_REQUEST_TIMEOUT;
    xhr.responseType = "text";
    xhr.open(method, url, true);
    xhr.send(body);
  }

  /**
   * 发送HTTP GET请求
   * @param url 地址
   * @param params 参数
   * @param headers HTTP请求头
   */
  public get(
    url: string,
    params?: interfaces.I_Simple_Object,
    headers?: interfaces.I_Simple_Object
  ) {
    if (params) {
      url += url.indexOf("?") === -1 ? "?" : "";
      url += this._getQueryString(params);
    }
    this._send(enums.E_Http_Method.Get, url, params, headers);
  }

  /**
   * 发送HTTP POST请求
   * @param url 地址
   * @param params 参数
   * @param headers HTTP请求头
   */
  public post(
    url: string,
    params?: interfaces.I_Simple_Object,
    headers?: interfaces.I_Simple_Object
  ) {
    this._send(enums.E_Http_Method.Post, url, params, headers);
  }

  /**
   * 获取当前请求数量
   */
  public count(): number {
    return this.m_requests.size;
  }

  /**
   * 输出数据
   */
  public dump() {
    logger.info("@HTTP服务", this.m_requests);
  }
}
