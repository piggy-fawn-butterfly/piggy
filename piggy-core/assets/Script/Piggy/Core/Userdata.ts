import { constants } from "../Const/Constant";
import { enums } from "../Const/Declare/Enums";
import { interfaces } from "../Const/Declare/Interfaces";
import { cocos } from "../Utils/Cocos";
import { objects } from "../Utils/Objects";
import { strings } from "../Utils/Strings";
import { app } from "./Component/App";
import { events } from "./Events";
import { i18n } from "./i18n";
import { logger } from "./Logger";
import { unreadable } from "./Unreadable";

/**
 * 原始数据
 */
const RAW_STRING = "{}";

/**
 * @file Userdata
 * @description 玩家本地数据
 * @todo //TODO 提取无关的接口到具体的文件
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
class UserData {
  private static s_instance: UserData = null;
  public static getInstance(): UserData {
    return (this.s_instance = this.s_instance || new UserData());
  }
  private m_raw_string: string = null;
  public m_raw_schemas: interfaces.I_Schema_Database;

  /**
   * 隐藏构造器
   */
  private constructor() {}

  /**
   * 初始化
   */
  public init() {
    let raw_string = storage.get(constants.DATABASE_NAME);
    !raw_string && (raw_string = RAW_STRING);
    if (raw_string && !strings.isJsonString(raw_string)) {
      //json解析失败意味着数据被修改
      events.getInstance().dispatch(constants.EVENT_NAME.ON_GAME_CHEATING);
      this.reset();
      throw i18n.I.text(i18n.K.player_cheating_detected);
    }
    this.m_raw_string = raw_string;
    this._loadSchemas();
  }

  /**
   * 加载表格
   */
  private _loadSchemas() {
    let raw_object = JSON.parse(this.m_raw_string);
    this.m_raw_schemas = objects.clone(constants.DATABASE_SCHEMA);
    Object.getOwnPropertyNames(constants.DATABASE_SCHEMA).forEach(name => {
      let data = raw_object[name];
      Object.getOwnPropertyNames(this.m_raw_schemas[name]).forEach(key => {
        if (data && typeof data[key] !== "undefined") {
          this.m_raw_schemas[name][key].val = data[key];
        }
      });
    });
    this.save();
  }

  /**
   * 保存到本地
   */
  public save() {
    let schemas = {};
    Object.getOwnPropertyNames(this.m_raw_schemas).forEach(name => {
      let schema = this.m_raw_schemas[name];
      schemas[name] = {};
      Object.getOwnPropertyNames(schema).forEach(key => {
        if (this.m_raw_schemas[name][key].val !== undefined) {
          schemas[name][key] = this.m_raw_schemas[name][key].val;
        }
      });
    });
    this.m_raw_string = JSON.stringify(schemas);
    storage.set(constants.DATABASE_NAME, this.m_raw_string);
    this.dump();
  }

  /**
   * 数据重置
   */
  public reset() {
    this.m_raw_string = RAW_STRING;
    this.m_raw_schemas = null;
    this._loadSchemas();
  }

  /**
   * 计算同类建筑数量
   */
  public getNumberOfBuilding(type: enums.E_Building_Type, level: number = 1) {
    let count = 0;
    Object.values(this.m_raw_schemas.map.building.val).forEach(
      building_info => {
        building_info.tm === type && building_info.lv === level && count++;
      }
    );
    return count;
  }

  /**
   * 获得建筑数量
   */
  public getBuildingNumber() {
    return Object.keys(this.m_raw_schemas.map.building.val).length;
  }

  /**
   * 地块坐标上是否有建筑
   * @param grid 地块坐标
   */
  public hasBuildingInGrid(grid: string) {
    return this.m_raw_schemas.map.building.val[grid];
  }

  /**
   * 在地块坐标上放置建筑
   */
  public layBuildingInGrid(
    grid: string,
    building_info: interfaces.I_Building_Info
  ) {
    this.m_raw_schemas.map.building.val[grid] = objects.clone(building_info);
  }

  /**
   * 数据输出
   */
  public dump() {
    logger.info(i18n.I.text(i18n.K.user_data), this.m_raw_schemas);
  }
}

/**
 * 存储操作封装
 */
namespace storage {
  /**
   * 获得存储字符串
   * @param name 存储键
   */
  export function get(name: string): string {
    let com = cocos.findComponent("Canvas", app);
    if (!com) return;
    let val = cc.sys.localStorage.getItem(name);
    if (!!val && typeof val === "string") {
      return com.isRelease() ? unreadable.decode(val) : val;
    }
    return val;
  }

  /**
   * 设置存储字符串
   * @param name 存储键
   * @param val 存储字符串
   */
  export function set(name: string, val: string) {
    let com = cocos.findComponent("Canvas", app);
    if (!com) return;
    val = com.isRelease() ? unreadable.encode(val) : val;
    cc.sys.localStorage.setItem(name, val);
  }
}

export { UserData as userdata };
