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

/**
 * 默认版本号
 * @summary 结构说明：
 * 主版本号.次版本号.补丁版本号
 */
export const VERSION_STRING = "1.0.0";

/**
 * 事件名称
 */
export const EVENT_NAME = {
  //system
  ON_BUTTON_CLICKED: "click",
  ON_CANVAS_RESIZE: "canvas-resize",
  ON_APP_SHOW: "game_on_show",
  ON_APP_HIDE: "game_on_hide",
  //internal
  ON_LANGUAGE_CHANGED: "on_language_changed",
  ON_GAME_CHEATING: "on_game_cheating",
  ON_BG_TOUCH_DOWN: "on_bg_touch_down",
  ON_BG_TOUCH_UP: "on_bg_touch_up",
  ON_BG_TOUCH_MOVE: "on_bg_touch_move",
  ON_BG_TOUCH_CANCEL: "on_bg_touch_cancel",
  ON_AUTO_SAVE_USER_DATA: "on_auto_save_user_data",
  ON_PAUSE_GAME_TIMER: "on_pause_game_timer",
  ON_RESUME_GAME_TIMER: "on_resume_game_timer",
  //user custom
  ON_ENTER_MAIN_UI: "on_enter_main_ui",
  ON_PICK_MAIN_MENU: "on_pick_main_menu",
  ON_PICK_BUILDING_ITEM: "on_pick_building_item",
  ON_ADD_BUILDING_TO_MAP: "on_add_building_to_map"
};