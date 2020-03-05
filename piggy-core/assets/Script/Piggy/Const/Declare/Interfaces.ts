/**
 * @file Interfaces
 * @description 公共接口声明文件
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
namespace interfaces {
  /**
   * websocket 消息携带数据
   * @param alive 心跳包间隔
   * @param key 其他数据
   */
  export interface I_Socket_Msg {
    alive: number;
    [key: string]: any;
  }

  /**
   * websocket 消息格式
   * @param type 消息类型
   * @param msg 消息携带数据
   */
  export interface I_Socket_Data {
    type: string;
    msg: I_Socket_Msg;
  }

  /**
   * 数字类型的存储值
   */
  export interface I_User_Value_Number {
    min: number;
    max: number;
    val: number;
  }

  /**
   * 布尔类型的存储值
   */
  export interface I_User_Value_Boolean {
    on(): void;
    off(): void;
    val: boolean;
  }

  /**
   * 资源加载进度回调
   */
  export interface I_Progress_Callback {
    (current: number, total: number, asset: cc.Asset): void;
  }

  /**
   * 资源加载完成回调
   */
  export interface I_Complete_Callback {
    (resources: string[]): void;
  }

  /**
   * 缓存资源信息
   */
  export interface I_Res_Cache_Asset {
    asset: cc.Asset;
    use: number;
  }

  /**
   * 缓存数量信息
   */
  export interface I_Res_Cache_Refer {
    refers: number;
    excludes: number;
  }

  /**
   * 音频信息
   */
  export interface I_Sound_Info {
    audio: number;
    type: "music" | "effect";
  }

  /**
   * 数据库音频格式
   */
  export interface I_Schema_Sound {
    volume: I_Value_Number;
    music: I_Value_Boolean;
    effect: I_Value_Boolean;
  }

  /**
   * 数据库数值类型
   */
  export interface I_Value_Number {
    max: number;
    min: number;
    val: number;
  }

  /**
   * 数据库布尔值类型
   */
  export interface I_Value_Boolean {
    val: boolean;
  }

  /**
   * 数据库资源格式
   */
  export interface I_Schema_Resource {
    ren_kou: I_Value_Number;
    liang_shi: I_Value_Number;
    xing_fu: I_Value_Number;
    xing_yang: I_Value_Number;
    jin_bi: I_Value_Number;
    mu_cai: I_Value_Number;
    kuang_chan: I_Value_Number;
  }

  /**
   * 建筑信息
   */
  export interface I_Building_Info {
    tm: string; //类型
    id: number; //标识
    lv: number; //等级
    ct: number; //开始建造时间-使用游戏计时
    lt: number; //开始升级时间-使用游戏计时
    no: number; //容纳人口数量
  }

  /**
   * 数据库建筑信息
   */
  export interface I_Value_Buildings {
    [key: string]: I_Building_Info;
  }

  /**
   * 数据库建筑信息格式
   */
  export interface I_Schema_Building {
    val: I_Value_Buildings;
  }

  /**
   * 数据库地图格式
   */
  export interface I_Schema_Map {
    building: I_Schema_Building;
  }

  /**
   * 数据库时间格式
   */
  export interface I_Schema_Time {
    game: I_Value_Number;
  }

  /**
   * 数据库格式
   */
  export interface I_Schema_Database {
    time: I_Schema_Time;
    resource: I_Schema_Resource;
    sound: I_Schema_Sound;
    map: I_Schema_Map;
  }
}

export { interfaces };
