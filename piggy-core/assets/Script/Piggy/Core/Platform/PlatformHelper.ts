/**
 * @file PlatformHelper
 * @description 平台辅助工具
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
class PlatformHelper {
  /**
   * 静态单例
   */
  private static s_instance: PlatformHelper = null;

  /**
   * 获取静态单例
   */
  public static getInstance(): PlatformHelper {
    return (PlatformHelper.s_instance =
      PlatformHelper.s_instance || new PlatformHelper());
  }

  /**
   * 登录
   */
  public login() {}

  /**
   * 登出
   */
  public logout() {}

  /**
   * 请求授权
   */
  public requestAuth() {}

  /**
   * 获取游戏ID
   */
  public getOpenId(): string {
    return "";
  }
}

export { PlatformHelper as platformHelper };
