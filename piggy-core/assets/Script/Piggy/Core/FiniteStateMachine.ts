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
 * let game_state = fsm.create(
 *   "ready",
 *   ["ready", "running", "paused", "stopped"],
 *   [
 *     { name: "ready", next: ["running"] },
 *     { name: "running", next: ["paused", "stopped"] },
 *     { name: "paused", next: ["running"] },
 *     { name: "stopped", next: ["ready"] }
 *   ]
 * );
 * game_state.dump();
 * logger.info("canTransitTo ready:", game_state.canTransitTo("ready"));
 * logger.info("canTransitTo running:", game_state.canTransitTo("running"));
 * logger.info("canTransitTo paused:", game_state.canTransitTo("paused"));
 * logger.info("canTransitTo stopped:", game_state.canTransitTo("stopped"));
 * game_state.transitTo("running").dump();
 * logger.info("canTransitTo ready:", game_state.canTransitTo("ready"));
 * logger.info("canTransitTo running:", game_state.canTransitTo("running"));
 * logger.info("canTransitTo paused:", game_state.canTransitTo("paused"));
 * logger.info("canTransitTo stopped:", game_state.canTransitTo("stopped"));
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
  export type T_FSM_STATE = string;

  /**
   * 状态机动作
   */
  export type T_FSM_TRANSITION = string;

  /**
   * 状态机状态切换配置
   */
  export interface I_FSM_TRANSITION {
    name: T_FSM_TRANSITION;
    from: T_FSM_STATE;
    to: T_FSM_STATE;
  }

  /**
   * 状态机配置
   */
  export interface I_Machine_Configuration {
    default_state: string;
    states: string[];
    transitions: I_FSM_TRANSITION[];
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
    const { default_state, states, transitions } = configuration;
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
   * 状态机回调
   */
  interface I_StateMachine_CallFunc {
    (machine: StateMachine): void;
  }

  /**
   * 创建一个状态机
   * @param configuration 状态机配置
   */
  export function create(
    configuration: I_Machine_Configuration
  ): Promise<StateMachine> {
    return new Promise((resolve, reject) => {
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
    private m_current_state: T_FSM_STATE;

    /**
     * 状态机构造器
     * @param default_state 默认状态值
     * @param states 状态列表
     * @param transitions 状态切换动作列表
     */
    constructor(configuration: I_Machine_Configuration) {
      this.m_category = ids.fsm.next();
      this.m_configuration = configuration;
      this.m_current_state = configuration.default_state;
    }

    /**
     * 获得当前状态
     */
    current(): T_FSM_STATE {
      return this.m_current_state;
    }

    /**
     * 判断当前状态
     * @param state 状态
     */
    is(state: T_FSM_STATE): boolean {
      return this.m_current_state === state;
    }

    /**
     * 是否可以切换到指定状态
     * @param state 状态
     */
    canTransitTo(transition: T_FSM_TRANSITION): I_FSM_TRANSITION {
      for (let i = 0; i < this.m_configuration.transitions.length; i++) {
        let t = this.m_configuration.transitions[i];
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
    transitTo(transition: T_FSM_TRANSITION): StateMachine {
      let target = this.canTransitTo(transition);
      if (!target) {
        let context = {
          state: this.m_current_state,
          transition: transition
        };
        logger.error(strings.render(i18n.I.text(i18n.K.fsm_tip_6), context));
      } else {
        this.m_current_state = target.to;
        events.dispatch(transition, target);
      }
      return this;
    }

    /**
     * 重置
     */
    reset(): StateMachine {
      this.m_current_state = this.m_configuration.default_state;
      return this;
    }

    /**
     * 输出信息
     */
    dump(): StateMachine {
      let info = i18n.I.text(i18n.K.fsm_tip_7);
      let label = strings.render(info, { category: this.m_category });
      let data = [
        i18n.I.text(i18n.K.fsm_tip_8) + this.m_current_state,
        i18n.I.text(i18n.K.fsm_tip_9) + this.m_configuration.default_state,
        i18n.I.text(i18n.K.fsm_tip_10),
        this.m_configuration.states.join("\n"),
        i18n.I.text(i18n.K.fsm_tip_11)
      ];
      this.m_configuration.transitions.forEach(transition => {
        data.push(`${transition.name}: ${transition.from} => ${transition.to}`);
      });
      logger.info(label, ...data);
      return this;
    }
  }
}
