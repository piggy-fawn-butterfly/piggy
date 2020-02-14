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
  [E_Text_Key.editor_choose_language]: "選擇語言"
};
