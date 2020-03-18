export class finite { }

import * as fsm from "./fsm";

/**
 * @file machines
 * @description 状态机管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class machines {

  constructor() {
    this.m_machines = new Map();
  }

  /**
   * 创建状态机
   * @param {object} configuration 状态机配置
   * @returns {fsm.machine}
   */
  create( configuration ) {
    let machine = fsm.create( configuration );
    if ( !machine ) return null;
    this.m_machines.set( machine.m_category, machine );
    return machine;
  }

  /**
   * 关闭状态机
   * - 不指定标识则关闭全部
   * @param {string} category 状态机标识
   */
  close( category = null ) {
    if ( category !== null ) {
      if ( this.m_machines.has( category ) ) {
        this.m_machines.get( category ).reset();
        this.m_machines.delete( category );
      }
    } else {
      this.m_machines.forEach( machine => {
        machine.reset();
      } );
      this.m_machines.clear();
    }
  }

  /**
   * 获得状态机
   * @param {string} category 状态机标识
   * @returns {fsm.machine}
   */
  get( category = null ) {
    return this.m_machines.get( category );
  }

  /**
   * 输出全部状态机数据
   */
  dump() {
    this.m_machines.forEach( machine => {
      machine.dump();
    } );
  }
}
