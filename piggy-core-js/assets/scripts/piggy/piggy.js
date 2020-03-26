//----------------------------------------------------------
// 常量、枚举
import { assets } from "./data/assets";
import { colors } from "./data/colors";
import { constants } from "./data/constants";
import { enums } from "./data/enums";
import { i18nK } from "./data/i18nK";
import { en } from "./data/locales/en";
import { es } from "./data/locales/es";
import { fr } from "./data/locales/fr";
import { jp } from "./data/locales/jp";
import { sc } from "./data/locales/sc";
import { tc } from "./data/locales/tc";
import { states } from "./data/states";
import { emoji } from "./data/emoji";

//----------------------------------------------------------
// 游戏配置
import { hex } from "./data/config/hex";

//----------------------------------------------------------
// 第三方库
import md5 from "./libs/md5";
import buffer from "./libs/buffer";
import * as luxon from "./libs/luxon";

//----------------------------------------------------------
// 辅助库
import { arrays } from "./utils/arrays";
import { cocos } from "./utils/cocos";
import { datetime } from "./utils/datetime";
import { kindof } from "./utils/kindof";
import { maths } from "./utils/maths";
import { objects } from "./utils/objects";
import { prando } from "./utils/prando";
import { strings } from "./utils/strings";
import { urls } from "./utils/urls";

//----------------------------------------------------------
// 核心库
import { events } from "./core/events";
import { i18n } from "./core/i18n";
import { ids } from "./core/ids";
import { logger } from "./core/logger";
import { fsm, machine } from "./core/fsm";
import { machines } from "./core/machines";
import { http } from "./core/http";
import { pool } from "./core/pool";
import { pools } from "./core/pools";
import { res } from "./core/res";
import { sound } from "./core/sound";
import { tick } from "./core/tick";
import { timer } from "./core/timer";
import { timers } from "./core/timers";
import { unreadable } from "./core/unreadable";
import { userdata } from "./core/userdata";
import { layers } from "./core/layers";

//----------------------------------------------------------
// 常量
piggy.constants = constants;
piggy.emoji = emoji;
piggy.colors = colors;
piggy.assets = assets;
piggy.enums = enums;
piggy.i18nK = i18nK;
piggy.states = states;
piggy.locales = { sc: sc, tc: tc, en: en, es: es, jp: jp, fr: fr };
piggy.constants.RES_TYPE_LIST = new Set(piggy.constants.RES_TYPE_FALLBACKS);
piggy.config.hex = hex;

//----------------------------------------------------------
/**
 * 判断开发模式
 * @param {piggy.enums.E_Dev_Mode} mode
 * @returns {boolean}
 */
piggy.mode.is = mode => {
  return piggy.mode.code === mode;
};

//----------------------------------------------------------
// 第三方库
piggy.md5 = md5;
piggy.buffer = buffer;
piggy.luxon = luxon;

//----------------------------------------------------------
// 辅助库
piggy.arrays = arrays;
piggy.cocos = cocos;
piggy.datetime = datetime;
piggy.kindof = kindof;
piggy.maths = maths;
piggy.objects = objects;
piggy.prando = prando;
piggy.strings = strings;
piggy.urls = urls;

//----------------------------------------------------------
// 核心库
piggy.class = {
  fsm: fsm,
  machine: machine,
  pool: pool,
  timer: timer
};

//----------------------------------------------------------
// 核心实例
piggy.ids = {
  event: new ids("event"),
  global: new ids("global"),
  http: new ids("http"),
  machine: new ids("machine"),
  pool: new ids("pool"),
  sound: new ids("sound"),
  timer: new ids("timer")
};
piggy.events = new events();
piggy.i18n = new i18n();
piggy.http = new http();
piggy.layers = new layers();
piggy.logger = new logger();
piggy.res = new res();
piggy.pools = new pools();
piggy.sound = new sound();
piggy.tick = new tick();
piggy.machines = new machines();
piggy.timers = new timers();
piggy.unreadable = new unreadable();
piggy.userdata = new userdata();

piggy.logger.info("piggy", piggy);
