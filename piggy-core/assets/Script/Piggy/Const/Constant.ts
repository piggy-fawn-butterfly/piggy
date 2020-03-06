/**
 * @file Constant
 * @description 常量
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
namespace constants {
  /**
   * Http请求超时时间
   */
  export const HTTP_REQUEST_TIMEOUT = 5000;

  /**
   * 主动关闭WebSocket的关闭码
   */
  export const WEBSOCKET_SELF_CLOSE_CODE = 4001;

  /**
   * 发送心跳包间隔
   */
  export const HEART_BEAT_INTERVAL = 30000;

  /**
   * 初次连接N秒后如果未连上则重连
   */
  export const RECONNECT_WHEN_CONNECTING = 5000;

  /**
   * 断开连接N秒后重连
   */
  export const RECONNECT_WHEN_DISCONNECT = 60000;

  /**
   * 测试服务器地址
   */
  export const SERVER_WEB_SOCKET_DEV = "wss://echo.websocket.org";
  export const SERVER_IO_SOCKET_DEV = "wss://echo.websocket.org";

  /**
   * UI事件类型
   */
  export const UI_EVENT_TYPE = Object.freeze({
    Touchable: [
      "touchstart",
      "touchout",
      "touchmove",
      "touchmove_in",
      "touchmove_out",
      "touchend",
      "touchcancel"
    ],
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
    "cc.EditBox": [
      "editing-did-began",
      "editing-did-ended",
      "text-changed",
      "editing-return"
    ],
    "cc.WebView": ["loading", "loading", "error"],
    "cc.VideoPlayer": [
      "meta-loaded",
      "ready-to-play",
      "clicked",
      "playing",
      "completed",
      "stopped",
      "paused"
    ],
    LayerBase: ["layer-open", "layer-close"]
  });

  /**
   * UI事件类型名称
   */
  export enum UI_EVENT_TYPE_NAME {
    "Touchable" = 0,
    "cc.ScrollView",
    "cc.Button",
    "cc.PageView",
    "cc.Toggle",
    "cc.Slider",
    "cc.EditBox",
    "cc.WebView",
    "cc.VideoPlayer",
    "LayerBase"
  }

  /**
   * 默认版本号
   * @summary 结构说明：
   * 主版本号.次版本号.补丁版本号
   */
  export const VERSION_STRING = "1.0.0";

  /**
   * 音量
   */
  export const VOLUME_VALUE = {
    MIN: 0,
    MAX: 100
  };

  /**
   * 最大时间
   */
  export const MAX_TIME = cc.macro.REPEAT_FOREVER;

  /**
   * 1秒的毫秒数
   */
  export const SEC_TO_MS = 1000;

  /**
   * 超过限定的离线时间后重启
   */
  export const OFFLINE_TO_RESTART = 60;

  /**
   * 自动保存时间间隔
   */
  export const AUTO_SAVE_INTERVAL = 60;

  /**
   * 事件名称
   */
  export const EVENT_NAME = Object.freeze({
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
  });

  /**
   * 资源类型
   */
  export const RES_TYPE_FALLBACKS = Object.freeze([
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
  ]);
  export const RES_TYPE_LIST = new Set(RES_TYPE_FALLBACKS);

  /**
   * 定义需要排除的无关资源数组
   */
  export const RES_TYPE_IN_CACHE_TO_EXCLUDES = new Set(["js", "json"]);

  /**
   * 默认数据库名称
   */
  export const DATABASE_NAME = "UserData";

  /**
   * 默认数据库格式
   * @requires interfaces.I_Schema_Database
   */
  export const DATABASE_SCHEMA = {
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
  };
}

export { constants };
