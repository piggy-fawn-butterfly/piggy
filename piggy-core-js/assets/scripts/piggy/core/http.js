/**
 * @file HttpClient
 * @description HTTP网络模块
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class http {
  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_requests = new Map();
  }

  /**
   * 构造请求参数
   * @param {object} params 参数
   * @returns {string}
   */
  _getQueryString( params ) {
    let keys = Object.keys( params );
    let walk = key => {
      return `${ key }=${ params[ key ] }`;
    };
    return Array.prototype.map.call( keys, walk ).join( "&" );
  }

  /**
   * 设置HTTP请求头
   * @param {XMLHttpRequest} xhr XMLHttpRequest
   * @param {object} headers HTTP请求头
   */
  _setRequestHeader( xhr, headers ) {
    for ( let key in headers ) {
      xhr.setRequestHeader( key, headers[ key ] );
    }
  }

  /**
   * 移除HTTP实例事件监听
   * @param {XMLHttpRequest} xhr XMLHttpRequest
   */
  _removeRequestEvent( xhr ) {
    xhr.onload = xhr.onloadstart = xhr.onloadend = xhr.onprogress = null;
    xhr.ontimeout = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
    this.m_requests.delete( xhr[ "http_request_id" ] );
  }

  /**
   * 请求超时
   * @param {XMLHttpRequest} xhr
   * @param {string} url
   */
  _onTimeout( xhr, url ) {
    piggy.logger.warn( "@HTTP请求超时", url, xhr );
    this._removeRequestEvent( xhr );
  }

  /**
   * 请求错误
   * @param {XMLHttpRequest} xhr
   * @param {string} url
   */
  _onError( xhr, url ) {
    piggy.logger.error( "@HTTP请求错误", url, xhr );
    this._removeRequestEvent( xhr );
  }

  /**
   * 请求终止
   * @param {XMLHttpRequest} xhr
   * @param {string} url
   */
  _onAbort( xhr, url ) {
    piggy.logger.error( "@HTTP请求终止", url, xhr );
    this._removeRequestEvent( xhr );
  }

  /**
   * 请求状态变化
   * @param {XMLHttpRequest} xhr
   * @param {string} url
   */
  _onChange( xhr, url ) {
    if ( xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 ) {
      try {
        const rep = JSON.parse( xhr.responseText );
        rep && rep.type && piggy.events.dispatch( rep.type, rep.msg );
        piggy.logger.info( "@HTTP消息内容", url, rep );
      } catch ( err ) {
        piggy.logger.error( "@HTTP消息错误", url, err, xhr );
      }
      this._removeRequestEvent( xhr );
    }
  }

  /**
   * 发送HTTP请求
   * @param {string} method HTTP方法
   * @param {string} url 地址
   * @param {object} params 参数
   * @param {object} headers HTTP请求头
   */
  _send( method, url, params, headers ) {
    let xhr = cc.loader.getXMLHttpRequest();

    //设置请求头
    headers = headers || {};
    cc.sys.isNative && ( headers[ "Accept-Encoding" ] = "gzip,deflate" );
    this._setRequestHeader( xhr, headers );

    //构造请求ID
    xhr[ "http_request_id" ] = piggy.ids.http.next();
    this.m_requests.set( xhr[ "http_request_id" ], url );

    //构造请求体
    let body = params instanceof Object ? JSON.stringify( params ) : "";

    //监听事件
    xhr.onreadystatechange = this._onChange.bind( this, xhr, url );
    xhr.ontimeout = this._onTimeout.bind( this, xhr, url );
    xhr.onerror = this._onError.bind( this, xhr, url );
    xhr.onabort = this._onAbort.bind( this, xhr, url );

    //发送请求
    xhr.timeout = piggy.constants.HTTP_REQUEST_TIMEOUT;
    xhr.responseType = "text";
    xhr.open( method, url, true );
    xhr.send( body );
  }

  /**
   * 发送HTTP GET请求
   * @param {string} url 地址
   * @param {object} params 参数
   * @param {object} headers HTTP请求头
   */
  get( url, params, headers ) {
    if ( params ) {
      url += url.indexOf( "?" ) === -1 ? "?" : "";
      url += this._getQueryString( params );
    }
    this._send( piggy.enums.E_Http_Method.Get, url, params, headers );
  }

  /**
   * 发送HTTP POST请求
   * @param {string} url 地址
   * @param {object} params 参数
   * @param {object} headers HTTP请求头
   */
  post( url, params, headers ) {
    this._send( piggy.enums.E_Http_Method.Post, url, params, headers );
  }

  /**
   * 获取当前请求数量
   * @returns {number}
   */
  count() {
    return this.m_requests.size;
  }

  /**
   * 输出数据
   */
  dump() {
    piggy.logger.info( "@HTTP服务", this.m_requests );
  }
}
