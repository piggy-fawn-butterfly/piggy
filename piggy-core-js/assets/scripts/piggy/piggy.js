/** @format */

//常量、枚举
import { constants } from "./data/constants";
import { colors } from "./data/colors";
import { assets } from "./data/assets";
import { enums } from "./data/enums";
import { i18nK } from "./data/i18nK";
import { states } from "./data/states";

//游戏配置
// import { xxx } from "./data/config/xxx";

//语言包
import { sc } from "./data/locales/sc";
import { tc } from "./data/locales/tc";
import { en } from "./data/locales/en";
import { es } from "./data/locales/es";
import { jp } from "./data/locales/jp";
import { fr } from "./data/locales/fr";

//第三方库
import md5 from "./libs/md5";
import buffer from "./libs/buffer";
import * as luxon from "./libs/luxon";

//辅助库
import { arrays } from "./utils/arrays";
import { cocos } from "./utils/cocos";
import { datetime } from "./utils/datetime";
import { kindof } from "./utils/kindof";
import { maths } from "./utils/maths";
import { objects } from "./utils/objects";
import { prando } from "./utils/prando";
import { strings } from "./utils/strings";
import { urls } from "./utils/urls";

//核心库
import { logger } from "./core/logger";
import * as fsm from "./core/fsm";
import { http } from "./core/http";
import { i18n } from "./core/i18n";
import { events } from "./core/events";
import { ids } from "./core/ids";
import { res } from "./core/res";
import { pool } from "./core/pool";
import { pools } from "./core/pools";
import { sound } from "./core/sound";
import { machines } from "./core/machines";
import { tick } from "./core/tick";
import { timer } from "./core/timer";
import { timers } from "./core/timers";
import { unreadable } from "./core/unreadable";
import { userdata } from "./core/userdata";

export const piggy = {
  //piggy基础信息
  information: {
    version: "1.0.0",
    author: "DoooReyn",
    name: "piggy",
    mail: "jl88744653@gmail.com",
    github: "https://github.com/DoooReyn",
    repository: "https://github.com/piggy-fawn-butterfly/piggy",
  },

  /**
   * 开发模式
   * - debug: -1
   * - beta: 0
   * - release: 1
   */
  mode: {
    code: 0,
    isRelease() { return piggy.mode.code = 1; },
    isBeta() { return piggy.mode.code === 0; },
    isDebug() { return piggy.mode.code === -1; },
  },

  //常量、枚举
  constants: constants,
  colors: colors,
  enums: enums,
  assets: assets,
  states: states,
  i18nK: i18nK,

  //游戏配置
  config: {
    /**
     * 获得配置表信息
     * @param {string} tbl
     * @returns {object}
     */
    table( tbl ) {
      return piggy.config[ tbl ];
    },

    /**
     * 获得配置表记录条目
     * @param {string} tbl
     * @param {string} key
     * @returns {any}
     */
    record( tbl, key ) {
      try {
        return piggy.config[ tbl ][ key ];
      } catch ( e ) {
        return null;
      }
    }
  },

  //语言包
  locales: { sc: sc, tc: tc, en: en, es: es, jp: jp, fr: fr },

  //第三方库
  md5: md5,
  buffer: buffer,
  luxon: luxon,

  //辅助库
  arrays: arrays,
  cocos: cocos,
  datetime: datetime,
  kindof: kindof,
  maths: maths,
  objects: objects,
  prando: prando,
  strings: strings,
  urls: urls,

  //核心库类
  class: {
    fsm: fsm,
    http: http,
    i18n: i18n,
    ids: ids,
    pool: pool,
    tick: tick,
    timer: timer,
    unreadable: unreadable,
    userdata: userdata
  },

  //核心库实例
  events: new events(),
  http: new http(),
  i18n: new i18n(),
  ids: {
    event: new ids( "event" ),
    global: new ids( "global" ),
    http: new ids( "http" ),
    machine: new ids( "machine" ),
    pool: new ids( "pool" ),
    sound: new ids( "sound" ),
    timer: new ids( "timer" )
  },
  logger: new logger(),
  res: new res(),
  pools: new pools(),
  sound: new sound(),
  tick: new tick(),
  machines: new machines(),
  timers: new timers(),
  unreadable: unreadable,
  userdata: new userdata()
};

console.log( piggy );
