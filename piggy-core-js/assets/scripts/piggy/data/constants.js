/**
 * @format
 * @file constants
 * @description 常量
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export const constants = {
  /**
   * 平台配置
   * @description
   * - WECHAT: 微信
   * - QQ: QQ
   * - ALIPAY: 支付宝
   * - BAIDU: 百度
   * - XIAOMI: 小米
   * - HUAWEI: 华为
   * - VIVO: VIVO
   * - OPPO: OPPO
   * - TOUTIAO: 头条
   * - TIKTOK: 抖音
   * - FACEBOOK: FaceBook
   */
  PLATFORM_CONF: {
    WECHAT: [
      "3864ffb6b0ba2cbe5a70d76c6e25a0df53539a84cad9f3b55d425815991c0cf53eabf0c572ac7e53",
      "3864ffb6b0ba2cbe5a70d76c6e25a0df1548c9d69bdfa2b35d4c094ece4c5ca53fa2b49370be2f75398089f850ab0d7c9a46d69b75e0"
    ],
    QQ: ["", ""],
    ALIPAY: ["", ""],
    BAIDU: ["", ""],
    XIAOMI: ["", ""],
    HUAWEI: ["", ""],
    VIVO: ["", ""],
    OPPO: ["", ""],
    TOUTIAO: ["", ""],
    TIKTOK: ["", ""],
    FACEBOOK: ["", ""]
  },

  /**
   * HTTP请求超时时间
   */
  HTTP_REQUEST_TIMEOUT: 5000,

  /**
   * 主动关闭WebSocket的关闭码
   */
  WEBSOCKET_SELF_CLOSE_CODE: 4001,

  /**
   * 发送心跳包间隔
   */
  HEART_BEAT_INTERVAL: 30000,

  /**
   * 连接时重连检测间隔
   */
  RECONNECT_WHEN_CONNECTING: 5000,

  /**
   * 断线重连检测间隔
   */
  RECONNECT_WHEN_DISCONNECT: 60000,

  /**
   * 服务器地址
   */
  SERVER_URL: {
    HTTP: {
      DEV: "http://localhost:8065",
      BETA: "http://localhost:8065",
      RELEASE: "http://xxxxxxxxx.xxx"
    },
    HTTPS: {
      DEV: "https://localhost:8066",
      BETA: "https://localhost:8066",
      RELEASE: "https://xxxxxxxxx.xxx"
    },
    WS: {
      DEV: "ws://localhost:9065/ws",
      BETA: "ws://localhost:9065/ws",
      RELEASE: "ws://xxxxxxxxx.xxx/ws"
    },
    WSS: {
      DEV: "wss://localhost:9066/wss",
      BETA: "wss://localhost:9066/wss",
      RELEASE: "wss://xxxxxxxxx.xxx/wss"
    }
  },

  /**
   * Server API
   */
  SERVER_API: {
    CHECK_SESSION_WX: "check_session_wx"
  },

  /**
   * UI事件类型
   */
  UI_EVENT_TYPE: {
    Touchable: ["touchstart", "touchout", "touchmove", "touchmove_in", "touchmove_out", "touchend", "touchcancel"],
    "cc.ScrollView": [
      "scroll-to-top",
      "scroll-to-bottom",
      "scroll-to-left",
      "scroll-to-right",
      "scrolling",
      "bounce-bottom",
      "bounce-left",
      "bounce-right",
      "bounce-top",
      "scroll-ended",
      "touch-up",
      "scroll-ended-with-threshold",
      "scroll-began"
    ],
    "cc.Button": ["click"],
    "cc.PageView": ["page-turning"],
    "cc.Toggle": ["toggle"],
    "cc.Slider": ["slide"],
    "cc.EditBox": ["editing-did-began", "editing-did-ended", "text-changed", "editing-return"],
    "cc.WebView": ["loading", "loading", "error"],
    "cc.VideoPlayer": ["meta-loaded", "ready-to-play", "clicked", "playing", "completed", "stopped", "paused"],
    LayerBase: ["layer-open", "layer-close"]
  },

  /**
   * UI事件类型名称
   */
  UI_EVENT_TYPE_NAME: cc.Enum({
    Touchable: 0,
    "cc.ScrollView": 1,
    "cc.Button": 2,
    "cc.PageView": 3,
    "cc.Toggle": 4,
    "cc.Slider": 5,
    "cc.EditBox": 6,
    "cc.WebView": 7,
    "cc.VideoPlayer": 8,
    LayerBase: 9
  }),

  /**
   * 默认版本号
   * @summary 结构说明：
   * 主版本号.次版本号.补丁版本号
   */
  VERSION_STRING: "1.0.0",

  /**
   * 音量
   */
  VOLUME_VALUE: {
    MIN: 0,
    MAX: 100
  },

  /**
   * 最大时间
   */
  MAX_TIME: cc.macro.REPEAT_FOREVER,

  /**
   * 1秒的毫秒数
   */
  SEC_TO_MS: 1000,

  /**
   * 超过限定的离线时间后重启
   */
  OFFLINE_TO_RESTART: 60,

  /**
   * 自动保存时间间隔
   */
  AUTO_SAVE_INTERVAL: 60,

  /**
   * 事件名称
   */
  EVENT_NAME: {
    //system
    ON_BUTTON_CLICKED: "click",
    ON_CANVAS_RESIZE: "canvas-resize",
    ON_RESOLUTION_RESIZE: "design-resolution-changed",
    ON_APP_SHOW: "game_on_show",
    ON_APP_HIDE: "game_on_hide",
    //internal
    ON_SOCKET_KEEP_ALIVE: "socket_keep_alive",
    ON_LANGUAGE_CHANGED: "on_language_changed",
    ON_GAME_CHEATING: "on_game_cheating",
    ON_BG_TOUCH_DOWN: "on_bg_touch_down",
    ON_BG_TOUCH_UP: "on_bg_touch_up",
    ON_BG_TOUCH_MOVE: "on_bg_touch_move",
    ON_BG_TOUCH_CANCEL: "on_bg_touch_cancel",
    ON_AUTO_SAVE_USER_DATA: "on_auto_save_user_data",
    ON_PAUSE_GAME_TIMER: "on_pause_game_timer",
    ON_RESUME_GAME_TIMER: "on_resume_game_timer",
    ON_DISPATCH_UI_EVENT: "on_dispatch_ui_event",
    ON_RESOURCES_LOADING: "on_resources_loading",
    ON_RESOURCES_LOADED: "on_resources_loaded",
    //user custom
    ON_ENTER_MAIN_UI: "on_enter_main_ui",
    ON_PICK_MAIN_MENU: "on_pick_main_menu",
    ON_PICK_BUILDING_ITEM: "on_pick_building_item",
    ON_ADD_BUILDING_TO_MAP: "on_add_building_to_map"
  },

  /**
   * 资源类型
   */
  RES_TYPE_FALLBACKS: [
    "cc.Model",
    "cc.Mesh",
    "cc.Material",
    "cc.EffectAsset",
    "dragonBones.DragonBonesAsset",
    "dragonBones.DragonBonesAtlasAsset",
    "sp.SkeletonData",
    "cc.SkeletonAnimationClip",
    "cc.Skeleton",
    "cc.AnimationClip",
    "cc.Prefab",
    "cc.BufferAsset",
    "cc.ParticleAsset",
    "cc.AudioClip",
    "cc.TiledMapAsset",
    "cc.TTFFont",
    "cc.BitmapFont",
    "cc.LabelAtlas",
    "cc.SpriteAtlas",
    "cc.SpriteFrame",
    "cc.Texture2D",
    "cc.JsonAsset",
    "cc.TextAsset",
    "cc.Asset"
  ],

  /**
   * 定义需要排除的无关资源数组
   */
  RES_TYPE_IN_CACHE_TO_EXCLUDES: new Set(["js", "json"]),

  /**
   * 默认数据库名称
   */
  DATABASE_NAME: "UserData",

  /**
   * 默认数据库格式
   * @requires interfaces.I_Schema_Database
   */
  DATABASE_SCHEMA: {
    time: {
      game: { min: 0, max: 9999999999, val: 0 }
    },
    resource: {
      ren_kou: { max: 300, min: 0, val: 10 },
      liang_shi: { max: 9999, min: 0, val: 500 },
      jin_bi: { max: 9999, min: 0, val: 500 },
      mu_cai: { max: 9999, min: 0, val: 500 },
      kuang_chan: { max: 9999, min: 0, val: 500 },
      xing_fu: { max: 100, min: 0, val: 50 },
      xing_yang: { max: 100, min: 0, val: 0 }
    },
    sound: {
      volume: { max: 100, min: 0, val: 80 },
      music: { val: true },
      effect: { val: true }
    },
    map: {
      building: {
        val: {
          "1515": {
            //主城
            tm: "castle",
            id: 1,
            lv: 1,
            ct: 0,
            lt: 0,
            no: 10
          }
        }
      }
    }
  },

  /**
   * 日期常数
   */
  DATE: {
    /** 1年 */
    YEAR: 31104000,
    /** 1个月 */
    MON: 2592000,
    /** 1天 */
    DAY: 86400,
    /** 1小时 */
    HOUR: 3600,
    /** 1分钟 */
    MIN: 60,
    /** 1秒钟 */
    SEC: 1
  },

  /**
   * 游戏日期常数
   * @description 只显示天数和小时，表示现实时间与游戏时间的转换关系
   */
  GAME_DATE: {
    /** 1小时的时间 */
    HOUR: 30,
    /** 白天开始的时间 */
    DAY_FROM: 30 * 6,
    /** 夜晚开始的时间 */
    NIGHT_FROM: 30 * 18,
    /** 半天的时间 */
    HALF_DAY: 30 * 12,
    /** 1天的时间 */
    DAY: 30 * 12 * 2,
    /** 1个月的时间 */
    MON: 30 * 12 * 2 * 30,
    /** 1个季度的时间 */
    SEASON: 30 * 12 * 2 * 30 * 3,
    /** 1年的时间 */
    YEAR: 30 * 12 * 2 * 30 * 3 * 4
  },

  /**
   * 日期模式
   */
  DATE_PATTERNS: {
    ERA: "G", //Era 标志符 Era strings. For example: "AD" and "BC"
    YEAR: "y", //年
    MONTH: "M", //月份
    DAY_OF_MONTH: "d", //月份的天数
    HOUR_OF_DAY1: "k", //一天中的小时数（1-24）
    HOUR_OF_DAY0: "H", //24小时制，一天中的小时数（0-23）
    MINUTE: "m", //小时中的分钟数
    SECOND: "s", //秒
    MILLISECOND: "S", //毫秒
    DAY_OF_WEEK: "E", //一周中对应的星期，如星期一，周一
    DAY_OF_YEAR: "D", //一年中的第几天
    DAY_OF_WEEK_IN_MONTH: "F", //一月中的第几个星期(会把这个月总共过的天数除以7,不够准确，推荐用W)
    WEEK_OF_YEAR: "w", //一年中的第几个星期
    WEEK_OF_MONTH: "W", //一月中的第几星期(会根据实际情况来算)
    AM_PM: "a", //上下午标识
    HOUR1: "h", //12小时制 ，am/pm 中的小时数（1-12）
    HOUR0: "K", //和h类型
    ZONE_NAME: "z", //时区名
    ZONE_VALUE: "Z", //时区值
    WEEK_YEAR: "Y", //和y类型
    ISO_DAY_OF_WEEK: "u",
    ISO_ZONE: "X"
  },

  /**
   * 号码正则表达式
   */
  PHONE_PATTERNS: {
    //中国电信号码段
    CHINA_TELECOM: /^(?:\+86)?1(?:33|53|7[37]|8[019])\d{8}$|^(?:\+86)?1700\d{7}$/,
    //中国联通号码段
    CHINA_UNICOM: /^(?:\+86)?1(?:3[0-2]|4[5]|5[56]|7[56]|8[56])\d{8}$|^(?:\+86)?170[7-9]\d{7}$/,
    //中国移动号码段
    CHINA_MOBILE: /^(?:\+86)?1(?:3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\d{8}$|^(?:\+86)?1705\d{7}$/,
    //电话座机号码段
    PHONE_CALL: /^(?:\(\d{3,4}\)|\d{3,4}-)?\d{7,8}(?:-\d{1,4})?$/,
    //手机号码
    PHONE_MOBILE: /^(?:\+86)?(?:13\d|14[57]|15[0-35-9]|17[35-8]|18\d)\d{8}$|^(?:\+86)?170[057-9]\d{7}$/,
    //手机号简单校验，不根据运营商分类
    PHONE_SIMPLE: /^(?:\+86)?1\d{10}$/,
    //邮箱地址
    EMAIL_ADDRESS: /^[-\w\+]+(?:\.[-\w]+)*@[-a-z0-9]+(?:\.[a-z0-9]+)*(?:\.[a-z]{2,})$/i,
    //18位身份证编码
    ID_CARD_18_SIMPLE: /^(?:1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5])\d{4}(?:1[89]|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}(?:\d|[xX])$/
  },

  TIMESTAMP_PATTERN: /(?=(YYYY|YY|MM|DD|HH|mm|ss|ms))\1([:\/]*)/g,
  TIMESTAMP_GROUPS: {
    YYYY: ["getFullYear", 4],
    YY: ["getFullYear", 2],
    MM: ["getMonth", 2, 1],
    DD: ["getDate", 2],
    HH: ["getHours", 2],
    mm: ["getMinutes", 2],
    ss: ["getSeconds", 2],
    ms: ["getMilliseconds", 3]
  }
};
