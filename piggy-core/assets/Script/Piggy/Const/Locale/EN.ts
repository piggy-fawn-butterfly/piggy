import { E_Text_Key } from "./TextKey";

/**
 * @file EN
 * @description 英文国际化配置
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
export const EN = {
  [E_Text_Key.editor_invalid_version_rule]: `[reset] version string does not comply with the rule: "Major.Minor.Patch"`,
  [E_Text_Key.unknown_language]: "unknown language",
  [E_Text_Key.editor_version_code]: "version string",
  [E_Text_Key.editor_version_state]: "version state",
  [E_Text_Key.editor_invalid_version_number]: `[fixed] version numbers can only consist of positive integers`,
  [E_Text_Key.editor_choose_language]: "choose language",
  [E_Text_Key.editor_auto_resize_for_browser]: "page auto resize for browser",
  [E_Text_Key.editor_browser_only]: "browser only",
  [E_Text_Key.date_week_1]: "Sunday",
  [E_Text_Key.date_week_2]: "Monday",
  [E_Text_Key.date_week_3]: "Tuesday",
  [E_Text_Key.date_week_4]: "Wednesday",
  [E_Text_Key.date_week_5]: "Thursday",
  [E_Text_Key.date_week_6]: "Friday",
  [E_Text_Key.date_week_7]: "Saturday",
  [E_Text_Key.date_am]: "AM",
  [E_Text_Key.date_pm]: "PM",
  [E_Text_Key.builtin_resources]: "builtin",
  [E_Text_Key.map_of_resources_path_and_type]: "path&type",
  [E_Text_Key.how_many_resources_loaded]: "{{num}} loaded",
  [E_Text_Key.unload_failed_for_non_exist]:
    "unload failed: asset not found.\n  path: {{path}}",
  [E_Text_Key.unload_failed_for_in_use]:
    "unload failed: asset in use.\n  path:${path}\n  refer:${use}",
  [E_Text_Key.builtin_depend_urls]: "·builtin depends:",
  [E_Text_Key.scene_depend_urls]: "·scene depends:",
  [E_Text_Key.cache_depend_urls]: "·dynamic depends:",
  [E_Text_Key.cc_loader_cache_urls]: "·cc.loader caches:",
  [E_Text_Key.static_script_files]: "·static scripts:",
  [E_Text_Key.resources_cache_count]: "·dynamic counts:",
  [E_Text_Key.resources_debug_info]: "debug information",
  [E_Text_Key.resource_cache_info]: "cache information",
  [E_Text_Key.resources_type_in_cache]: "types in dynamic resources",
  [E_Text_Key.invalid_resource_path]: "invalid resource path",
  [E_Text_Key.pool_information]: "pool information",
  [E_Text_Key.audio_resource_no_found]: "@missing audio resource",
  [E_Text_Key.player_cheating_detected]: "player cheating detected",
  [E_Text_Key.audio_volume]: "volume:",
  [E_Text_Key.audio_information]: "path:{{path}} type:{{type}} state:{{state}}",
  [E_Text_Key.audio_all_information]: "audio information",
  [E_Text_Key.timer_information]:
    "name:{{name}} state:{{state}} current:{{elapse}} rest:{{rest}}",
  [E_Text_Key.timer_all_information]: "timers information",
  [E_Text_Key.app_entering]: "the app is entering the foreground",
  [E_Text_Key.app_exiting]: "the app is entering the background",
  [E_Text_Key.app_entered]: "the app has entered the foreground",
  [E_Text_Key.app_exited]: "the app has entered the background",
  [E_Text_Key.app_offline_time]: "app offline time:{{time}}s",
  [E_Text_Key.fsm_tip_1]:
    "the state machine should contain at least two states",
  [E_Text_Key.fsm_tip_2]:
    "The default state must be an item in the states list",
  [E_Text_Key.fsm_tip_3]:
    "The state machine should contain at least one state switching action",
  [E_Text_Key.fsm_tip_4]: "states must be an item in the states list",
  [E_Text_Key.fsm_tip_5]: "@failed to create state machine",
  [E_Text_Key.fsm_tip_6]:
    "current state {{state}} can not switch to {{transition}}",
  [E_Text_Key.fsm_tip_7]: "state machine {{category}} information",
  [E_Text_Key.fsm_tip_8]: "current state:",
  [E_Text_Key.fsm_tip_9]: "default state:",
  [E_Text_Key.fsm_tip_10]: "states list:",
  [E_Text_Key.fsm_tip_11]: "transitions list:",
  [E_Text_Key.user_data]: "User Data"
};
