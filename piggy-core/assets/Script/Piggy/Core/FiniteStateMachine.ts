import { i18n } from "./i18n";
import { logger } from "./Logger";
import { events } from "./Events";
import { ids } from "./IdGenerator";
import { strings } from "../Utils/Strings";

/**
 * @file FiniteStateMachine
 * @description 有限状态机
 * @namespace
 * @author DoooReyn <jl88744653@gmail.com>
 * @example
 * ```js
 * let machine = fsm.create(states.app);
 * machine.dump();
 * logger.info("canTransitTo ready:", machine.canTransitTo("running"));
 * machine.transitTo("running").dump();
 * logger.info("canTransitTo ready:", machine.canTransitTo("ready"));
 * machine.dump();
 * ```
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
export namespace fsm {
  /**
   * 状态机状态值
   */
  export type T_Fsm_State = string;

  /**
   * 状态机动作
   */
  export type T_Fsm_Transition = string;

  /**
   * 状态机状态切换配置
   */
  export interface I_FSM_TRANSITION {
    name: T_Fsm_Transition;
    from: T_Fsm_State;
    to: T_Fsm_State;
  }

  export interface I_Fsm_Transitions {
    [key: string]: any;
  }

  export interface I_Fsm_States {
    [key: string]: any;
  }

  export interface I_Fsm_Structure {
    default_state: string;
    states: string[];
    transitions: I_FSM_TRANSITION[];
  }

  /**
   * 状态机配置
   */
  export interface I_Machine_Configuration {
    name: string;
    transition: I_Fsm_Transitions;
    state: I_Fsm_States;
    structure: I_Fsm_Structure;
  }

  /**
   * 包装错误信息
   * @param msg 错误信息
   */
  function wrapErrorMsg(msg: string) {
    throw new Error(msg);
  }

  /**
   * 检查状态机配置
   * @param configuration 状态机配置
   */
  export function isValidStateMachine(configuration: I_Machine_Configuration) {
    const { default_state, states, transitions } = configuration.structure;
    states.length <= 1 && wrapErrorMsg(i18n.I.text(i18n.K.fsm_tip_1));
    !states.includes(default_state) &&
      wrapErrorMsg(i18n.I.text(i18n.K.fsm_tip_2));
    transitions.length <= 0 && wrapErrorMsg(i18n.I.text(i18n.K.fsm_tip_3));
    for (let i = 0; i < transitions.length; i++) {
      let transition = transitions[i];
      (!states.includes(transition.from) || !states.includes(transition.to)) &&
        wrapErrorMsg(i18n.I.text(i18n.K.fsm_tip_4));
    }
  }

  /**
   * 创建一个状态机
   * @param configuration 状态机配置
   */
  export function create(
    configuration: I_Machine_Configuration
  ): Promise<StateMachine> {
    return new Promise(resolve => {
      try {
        isValidStateMachine(configuration);
        let machine = new StateMachine(configuration);
        resolve(machine);
      } catch (e) {
        logger.error(i18n.I.text(i18n.K.fsm_tip_5), e);
        resolve(null);
      }
    });
  }

  /**
   * 状态机
   * @class
   */
  export class StateMachine {
    public m_category: string;
    private m_configuration: I_Machine_Configuration;
    private m_current_state: T_Fsm_State;

    /**
     * 状态机构造器
     * @param default_state 默认状态值
     * @param states 状态列表
     * @param transitions 状态切换动作列表
     */
    constructor(configuration: I_Machine_Configuration) {
      this.m_category = ids.fsm.next();
      this.m_configuration = configuration;
      this.m_current_state = configuration.structure.default_state;
    }

    /**
     * 获得状态机名称
     */
    public name(): string {
      return this.m_configuration.name;
    }

    /**
     * 获得当前状态
     */
    public current(): T_Fsm_State {
      return this.m_current_state;
    }

    /**
     * 判断当前状态
     * @param state 状态
     */
    public is(state: T_Fsm_State): boolean {
      return this.m_current_state === state;
    }

    /**
     * 是否可以切换到指定状态
     * @param state 状态
     */
    public canTransitTo(transition: T_Fsm_Transition): I_FSM_TRANSITION {
      let transitions = this.m_configuration.structure.transitions;
      for (let i = 0; i < transitions.length; i++) {
        let t = transitions[i];
        if (t.name === transition && t.from === this.m_current_state) {
          return t;
        }
      }
      return null;
    }

    /**
     * 切换动作
     * @param transition 动作
     */
    public transitTo(transition: T_Fsm_Transition): StateMachine {
      let target = this.canTransitTo(transition);
      if (!target) {
        let context = {
          state: this.m_current_state,
          transition: transition
        };
        logger.error(strings.render(i18n.I.text(i18n.K.fsm_tip_6), context));
      } else {
        this.m_current_state = target.to;
        events.getInstance().dispatch(this.m_category, target);
      }
      return this;
    }

    /**
     * 重置
     */
    public reset(): StateMachine {
      this.m_current_state = this.m_configuration.structure.default_state;
      return this;
    }

    /**
     * 输出信息
     */
    public dump(): StateMachine {
      let info = i18n.I.text(i18n.K.fsm_tip_7);
      let label = strings.render(info, { category: this.m_category });
      let data = [
        i18n.I.text(i18n.K.fsm_tip_8) + this.m_current_state,
        i18n.I.text(i18n.K.fsm_tip_9) +
          this.m_configuration.structure.default_state,
        i18n.I.text(i18n.K.fsm_tip_10),
        this.m_configuration.structure.states.join("\n"),
        i18n.I.text(i18n.K.fsm_tip_11)
      ];
      this.m_configuration.structure.transitions.forEach(transition => {
        data.push(`${this.name()}: ${transition.from} => ${transition.to}`);
      });
      logger.info(label, ...data);
      return this;
    }
  }
}
