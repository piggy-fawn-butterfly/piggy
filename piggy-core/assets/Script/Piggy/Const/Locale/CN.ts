import { E_Text_Key } from "./TextKey";

/**
 * @file CN
 * @description 中文国际化配置
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
export const CN = {
  [E_Text_Key.editor_invalid_version_rule]: `[已重置] 版本号不符合规则："主版本号.次版本号.补丁版本号"`,
  [E_Text_Key.unknown_language]: "未知语言",
  [E_Text_Key.editor_version_code]: "版本号",
  [E_Text_Key.editor_version_state]: "版本选择",
  [E_Text_Key.editor_invalid_version_number]: `[已修正] 版本号只能由正整数组成`,
  [E_Text_Key.editor_choose_language]: "选择语言",
  [E_Text_Key.editor_auto_resize_for_browser]: "浏览器自动满屏",
  [E_Text_Key.editor_browser_only]: "仅适用于浏览器",
  [E_Text_Key.date_week_1]: "星期一",
  [E_Text_Key.date_week_2]: "星期二",
  [E_Text_Key.date_week_3]: "星期三",
  [E_Text_Key.date_week_4]: "星期四",
  [E_Text_Key.date_week_5]: "星期五",
  [E_Text_Key.date_week_6]: "星期六",
  [E_Text_Key.date_week_7]: "星期日",
  [E_Text_Key.date_am]: "上午",
  [E_Text_Key.date_pm]: "下午",
  [E_Text_Key.builtin_resources]: "内置资源列表",
  [E_Text_Key.map_of_resources_path_and_type]: "资源列表路径与类型映射",
  [E_Text_Key.how_many_resources_loaded]: "{{num}}个资源加载完成",
  [E_Text_Key.unload_failed_for_non_exist]:
    "资源卸载失败：资源不存在。\n  {{path}}",
  [E_Text_Key.unload_failed_for_in_use]:
    "资源卸载失败：资源使用中。\n  路径:${path}\n  引用:${use}",
  [E_Text_Key.builtin_depend_urls]: "·内置资源依赖:",
  [E_Text_Key.scene_depend_urls]: "·场景资源依赖:",
  [E_Text_Key.cache_depend_urls]: "·资源缓存依赖:",
  [E_Text_Key.cc_loader_cache_urls]: "·cc.loader缓存依赖:",
  [E_Text_Key.static_script_files]: "  程序脚本数量:",
  [E_Text_Key.resources_cache_count]: "·已缓存资源:",
  [E_Text_Key.resources_debug_info]: "资源调试信息",
  [E_Text_Key.resource_cache_info]: "资源缓存数据",
  [E_Text_Key.resources_type_in_cache]: "资源列表存在的资源类型",
  [E_Text_Key.invalid_resource_path]: "无效的资源路径",
  [E_Text_Key.pool_information]: "@对象池数据",
  [E_Text_Key.audio_resource_no_found]: "@音频资源不存在",
  [E_Text_Key.player_cheating_detected]: "检测到玩家作弊",
  [E_Text_Key.audio_volume]: "音量:",
  [E_Text_Key.audio_information]: "路径:{{path}} 类型:{{type}} 状态:{{state}}",
  [E_Text_Key.audio_all_information]: "音频信息",
  [E_Text_Key.timer_information]:
    "名称:{{name}} 状态:{{state}} 当前:{{elapse}} 剩余:{{rest}}",
  [E_Text_Key.timer_all_information]: "定时器信息",
  [E_Text_Key.app_entering]: "应用正在进入前台",
  [E_Text_Key.app_exiting]: "应用正在进入后台",
  [E_Text_Key.app_entered]: "应用已经进入前台",
  [E_Text_Key.app_exited]: "应用已经进入后台",
  [E_Text_Key.app_offline_time]: "应用离线时间:{{time}}s",
  [E_Text_Key.fsm_tip_1]: "状态机至少应该包含两种状态",
  [E_Text_Key.fsm_tip_2]: "默认状态必须是状态列表中的一项",
  [E_Text_Key.fsm_tip_3]: "状态机至少应该包含一种状态切换动作",
  [E_Text_Key.fsm_tip_4]: "状态必须是状态列表中的一项",
  [E_Text_Key.fsm_tip_5]: "@状态机创建失败",
  [E_Text_Key.fsm_tip_6]: "状态机当前状态{{state}}无法切换到{{transition}}动作",
  [E_Text_Key.fsm_tip_7]: "@状态机{{category}}数据",
  [E_Text_Key.fsm_tip_8]: "当前状态:",
  [E_Text_Key.fsm_tip_9]: "默认状态:",
  [E_Text_Key.fsm_tip_10]: "状态列表:",
  [E_Text_Key.fsm_tip_11]: "动作列表:"
};
