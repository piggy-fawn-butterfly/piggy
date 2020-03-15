import { fsm } from "./FiniteStateMachine";

/**
 * @file Machines
 * @description 状态机管理器
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
class Machines {
  private static s_instance: Machines = null;
  public static getInstance(): Machines {
    return (this.s_instance = this.s_instance || new Machines());
  }

  private m_machines: Map<string, fsm.StateMachine>;
  private constructor() {
    this.m_machines = new Map();
  }

  /**
   * 创建状态机
   * @param configuration 状态机配置
   */
  public async create(
    configuration: fsm.I_Machine_Configuration
  ): Promise<fsm.StateMachine> {
    let machine = await fsm.create(configuration);
    machine && this.m_machines.set(machine.m_category, machine);
    return machine || null;
  }

  /**
   * 关闭状态机
   * - 不指定标识则关闭全部
   * @param category 状态机
   */
  public close(category: string) {
    if (category !== null) {
      if (this.m_machines.has(category)) {
        this.m_machines.get(category).reset();
        this.m_machines.delete(category);
      }
    } else {
      this.m_machines.forEach(machine => {
        machine.reset();
      });
      this.m_machines.clear();
    }
  }

  /**
   * 获得状态机
   */
  public get(category: string): fsm.StateMachine {
    return this.m_machines.get(category);
  }

  /**
   * 输出全部状态机数据
   */
  public dump() {
    this.m_machines.forEach(machine => {
      machine.dump();
    });
  }
}

export { Machines as machines };
