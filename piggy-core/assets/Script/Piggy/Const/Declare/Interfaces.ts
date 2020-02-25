/**
 * @file Interfaces
 * @description 公共接口声明文件
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
namespace interfaces {
  /**
   * 数字类型的存储值
   */
  export interface I_User_Value_Number {
    min: number;
    max: number;
    val: number;
  }

  /**
   * 布尔类型的存储值
   */
  export interface I_User_Value_Boolean {
    on(): void;
    off(): void;
    val: boolean;
  }

  /**
   * 资源加载进度回调
   */
  export interface I_Progress_Callback {
    (current: number, total: number, asset: cc.Asset): void;
  }

  /**
   * 资源加载完成回调
   */
  export interface I_Complete_Callback {
    (resources: string[]): void;
  }

  /**
   * 缓存资源信息
   */
  export interface I_Res_Cache_Asset {
    asset: cc.Asset;
    use: number;
  }

  /**
   * 缓存数量信息
   */
  export interface I_Res_Cache_Refer {
    refers: number;
    excludes: number;
  }
}

export { interfaces };
