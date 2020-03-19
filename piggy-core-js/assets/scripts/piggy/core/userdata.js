import { piggy } from "../piggy";

/**
 * 原始数据
 */
const RAW_STRING = "{}";

/**
 * @file Userdata
 * @description 玩家本地数据
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class userdata {
  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_raw_string = null;
    this.m_raw_schemas = null;
  }

  /**
   * 初始化
   */
  init() {
    let raw_string = storage.get( piggy.constants.DATABASE_NAME );
    !raw_string && ( raw_string = RAW_STRING );
    if ( raw_string && !piggy.strings.isJsonString( raw_string ) ) {
      //json解析失败意味着数据被修改
      piggy.events.dispatch( piggy.constants.EVENT_NAME.ON_GAME_CHEATING );
      this.reset();
      throw piggy.i18n.t( piggy.i18nK.player_cheating_detected );
    }
    this.m_raw_string = raw_string;
    this._loadSchemas();
  }

  /**
   * 加载表格
   */
  _loadSchemas() {
    let raw_object = JSON.parse( this.m_raw_string );
    this.m_raw_schemas = piggy.objects.clone( piggy.constants.DATABASE_SCHEMA );
    Object.getOwnPropertyNames( piggy.constants.DATABASE_SCHEMA ).forEach( name => {
      let data = raw_object[ name ];
      Object.getOwnPropertyNames( this.m_raw_schemas[ name ] ).forEach( key => {
        if ( data && typeof data[ key ] !== "undefined" ) {
          this.m_raw_schemas[ name ][ key ].val = data[ key ];
        }
      } );
    } );
    this.save();
  }

  /**
   * 保存到本地
   */
  save() {
    let schemas = {};
    Object.getOwnPropertyNames( this.m_raw_schemas ).forEach( name => {
      let schema = this.m_raw_schemas[ name ];
      schemas[ name ] = {};
      Object.getOwnPropertyNames( schema ).forEach( key => {
        if ( this.m_raw_schemas[ name ][ key ].val !== undefined ) {
          schemas[ name ][ key ] = this.m_raw_schemas[ name ][ key ].val;
        }
      } );
    } );
    this.m_raw_string = JSON.stringify( schemas );
    storage.set( piggy.constants.DATABASE_NAME, this.m_raw_string );
    this.dump();
  }

  /**
   * 数据重置
   */
  reset() {
    this.m_raw_string = RAW_STRING;
    this.m_raw_schemas = null;
    this._loadSchemas();
  }

  /**
   * 数据输出
   */
  dump() {
    piggy.logger.info( piggy.i18n.t( piggy.i18nK.user_data ), this.m_raw_schemas );
  }
}

/**
 * 存储操作封装
 */
class storage {
  /**
   * 获得存储字符串
   * @param {string} name 存储键
   * @returns {string}
   */
  static get( name ) {
    let val = cc.sys.localStorage.getItem( name );
    if ( !!val && typeof val === "string" ) {
      return piggy.mode.isRelease() ? piggy.unreadable.decode( val ) : val;
    }
    return val;
  }

  /**
   * 设置存储字符串
   * @param {string} name 存储键
   * @param {string} val 存储字符串
   */
  static set( name, val ) {
    val = piggy.mode.isRelease() ? piggy.unreadable.encode( val ) : val;
    cc.sys.localStorage.setItem( name, val );
  }
}
