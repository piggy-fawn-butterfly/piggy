/**
 * @file IdGenerator
 * @description Id生成器
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
class IdGenerator {
  private id: number = 0;
  private category: string = "";

  /**
   * Id生成器构造器
   * @param category 类型
   */
  constructor(category: string) {
    this.category = category || "default";
    this.id = 0 | (Math.random() * 998);
  }

  /**
   * 获取新的id
   */
  next() {
    return this.category + "." + ++this.id;
  }
}

export namespace ids {
  export const global = new IdGenerator("global");
  export const event = new IdGenerator("event");
  export const timer = new IdGenerator("timer");
  export const fsm = new IdGenerator("fsm");
  export const pool = new IdGenerator("pool");
  export const http = new IdGenerator("http");
}
