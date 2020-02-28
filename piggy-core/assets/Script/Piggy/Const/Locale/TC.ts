import { E_Text_Key } from "./TextKey";

/**
 * @file TC
 * @description 繁體中文國際化配置
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
export const TC = {
  [E_Text_Key.editor_invalid_version_rule]: `[已重置] 版本號不符合規則："主版本號.次版本號.補丁版本號"`,
  [E_Text_Key.unknown_language]: "未知語言",
  [E_Text_Key.editor_version_code]: "版本號",
  [E_Text_Key.editor_version_state]: "版本選擇",
  [E_Text_Key.editor_invalid_version_number]: `[已修正] 版本號隻能由正整數組成`,
  [E_Text_Key.editor_choose_language]: "選擇語言",
  [E_Text_Key.editor_auto_resize_for_browser]: "瀏覽器自動滿屏",
  [E_Text_Key.editor_browser_only]: "僅適用於瀏覽器",
  [E_Text_Key.date_week_1]: "星期一",
  [E_Text_Key.date_week_2]: "星期二",
  [E_Text_Key.date_week_3]: "星期三",
  [E_Text_Key.date_week_4]: "星期四",
  [E_Text_Key.date_week_5]: "星期五",
  [E_Text_Key.date_week_6]: "星期六",
  [E_Text_Key.date_week_7]: "星期日",
  [E_Text_Key.date_am]: "上午",
  [E_Text_Key.date_pm]: "下午",
  [E_Text_Key.builtin_resources]: "內置資源列錶",
  [E_Text_Key.map_of_resources_path_and_type]: "資源列錶路徑與類型映射",
  [E_Text_Key.how_many_resources_loaded]: "{{num}}個資源加載完成",
  [E_Text_Key.unload_failed_for_non_exist]:
    "資源卸載失敗：資源不存在。\n  {{path}}",
  [E_Text_Key.unload_failed_for_in_use]:
    "資源卸載失敗：資源使用中。\n  路徑:${path}\n  引用:${use}",
  [E_Text_Key.builtin_depend_urls]: "·內置資源依賴:",
  [E_Text_Key.scene_depend_urls]: "·場景資源依賴:",
  [E_Text_Key.cache_depend_urls]: "·資源緩存依賴:",
  [E_Text_Key.cc_loader_cache_urls]: "·cc.loader緩存依賴:",
  [E_Text_Key.static_script_files]: "  程序腳本數量:",
  [E_Text_Key.resources_cache_count]: "·已緩存資源:",
  [E_Text_Key.resources_debug_info]: "資源調試信息",
  [E_Text_Key.resource_cache_info]: "資源緩存數據",
  [E_Text_Key.resources_type_in_cache]: "資源列錶存在的資源類型",
  [E_Text_Key.invalid_resource_path]: "無效的資源路徑",
  [E_Text_Key.pool_information]: "@對象池數據",
  [E_Text_Key.audio_resource_no_found]: "@音頻資源不存在",
  [E_Text_Key.player_cheating_detected]: "檢測到玩家作弊",
  [E_Text_Key.audio_volume]: "音量:",
  [E_Text_Key.audio_information]: "路徑:{{path}} 類型:{{type}} 狀態:{{state}}",
  [E_Text_Key.audio_all_information]: "音頻信息",
  [E_Text_Key.timer_information]:
    "名稱:{{name}} 狀態:{{state}} 當前:{{elapse}} 剩餘:{{rest}}",
  [E_Text_Key.timer_all_information]: "定時器信息",
  [E_Text_Key.app_entering]: "應用正在進入前臺",
  [E_Text_Key.app_exiting]: "應用正在進入後臺",
  [E_Text_Key.app_entered]: "應用已經進入前臺",
  [E_Text_Key.app_exited]: "應用已經進入後臺",
  [E_Text_Key.app_offline_time]: "應用離線時間:{{time}}s",
  [E_Text_Key.fsm_tip_1]: "狀態機至少應該包含兩種狀態",
  [E_Text_Key.fsm_tip_2]: "默認狀態必須是狀態列錶中的一項",
  [E_Text_Key.fsm_tip_3]: "狀態機至少應該包含一種狀態切換動作",
  [E_Text_Key.fsm_tip_4]: "狀態必須是狀態列錶中的一項",
  [E_Text_Key.fsm_tip_5]: "@狀態機創建失敗",
  [E_Text_Key.fsm_tip_6]: "狀態機當前狀態{{state}}無法切換到{{transition}}動作",
  [E_Text_Key.fsm_tip_7]: "狀態機{{category}}數據",
  [E_Text_Key.fsm_tip_8]: "當前狀態:",
  [E_Text_Key.fsm_tip_9]: "默認狀態:",
  [E_Text_Key.fsm_tip_10]: "狀態列錶:",
  [E_Text_Key.fsm_tip_11]: "動作列錶:",
  [E_Text_Key.user_data]: "玩家數據"
};
