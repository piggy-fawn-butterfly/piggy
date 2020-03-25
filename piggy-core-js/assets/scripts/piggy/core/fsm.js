/**
 * @format
 * @file fsm
 * @description 有限状态机
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */

/**
 * 检查状态机配置
 * @param {object} configuration 状态机配置
 * @returns {boolean}
 */
export function isValid( configuration ) {
  if ( !configuration.structure ) {
    return false;
  }
  const structure = configuration.structure;
  if ( !structure.states || !structure.default_state || !structure.transitions ) {
    return false;
  }
  const { default_state, states, transitions } = structure;
  if ( states.length <= 1 ) {
    piggy.logger.error( piggy.i18n.t( piggy.i18nK.fsm_tip_1 ) );
    return false;
  }
  if ( !states.includes( default_state ) ) {
    piggy.logger.error( piggy.i18n.t( piggy.i18nK.fsm_tip_2 ) );
    return false;
  }
  if ( transitions.length <= 0 ) {
    piggy.logger.error( piggy.i18n.t( piggy.i18nK.fsm_tip_3 ) );
    return false;
  }
  for ( let i = 0; i < transitions.length; i++ ) {
    let transition = transitions[ i ];
    if ( !states.includes( transition.from ) || !states.includes( transition.to ) ) {
      piggy.logger.error( piggy.i18n.t( piggy.i18nK.fsm_tip_4 ) );
      return false;
    }
  }
  return true;
}

/**
 * 创建一个状态机
 * @param {object} configuration 状态机配置
 * @returns {machine}
 */
export function create( configuration ) {
  return isValid( configuration ) ? new machine( configuration ) : null;
}

/**
 * 状态机
 * @class
 */
export class machine {
  /**
   * 状态机构造器
   * @param {object} configuration 默认状态值
   */
  constructor( configuration ) {
    this.m_category = piggy.ids.fsm.next();
    this.m_configuration = configuration;
    this.m_current_state = configuration.structure.default_state;
  }

  /**
   * 获得状态机名称
   * @returns {string}
   */
  name() {
    return this.m_configuration.name;
  }

  /**
   * 获得当前状态
   * @returns {string}
   */
  current() {
    return this.m_current_state;
  }

  /**
   * 判断当前状态
   * @param {string} state 状态
   * @returns {boolean}
   */
  is( state ) {
    return this.m_current_state === state;
  }

  /**
   * 是否可以切换到指定状态
   * @param {string} transition 状态
   * @returns {object}
   */
  canTransitTo( transition ) {
    let transitions = this.m_configuration.structure.transitions;
    for ( let i = 0; i < transitions.length; i++ ) {
      let t = transitions[ i ];
      if ( t.name === transition && t.from === this.m_current_state ) {
        return t;
      }
    }
    return null;
  }

  /**
   * 切换动作
   * @param {string} transition 动作
   * @returns {machine}
   */
  transitTo( transition ) {
    let target = this.canTransitTo( transition );
    if ( !target ) {
      let context = {
        state: this.m_current_state,
        transition: transition
      };
      piggy.logger.error( piggy.strings.render( piggy.i18n.t( piggy.i18nK.fsm_tip_6 ), context ) );
    } else {
      this.m_current_state = target.to;
      piggy.events.dispatch( this.m_category, target );
    }
    return this;
  }

  /**
   * 重置
   * @returns {machine}
   */
  reset() {
    this.m_current_state = this.m_configuration.structure.default_state;
    return this;
  }

  /**
   * 输出信息
   * @returns {machine}
   */
  dump() {
    let info = piggy.i18n.t( piggy.i18nK.fsm_tip_7 );
    let label = piggy.strings.render( info, { category: this.m_category } );
    let data = [
      piggy.i18n.t( piggy.i18nK.fsm_tip_8 ) + this.m_current_state,
      piggy.i18n.t( piggy.i18nK.fsm_tip_9 ) + this.m_configuration.structure.default_state,
      piggy.i18n.t( piggy.i18nK.fsm_tip_10 ),
      this.m_configuration.structure.states.join( "\n" ),
      piggy.i18n.t( piggy.i18nK.fsm_tip_11 )
    ];
    this.m_configuration.structure.transitions.forEach( transition => {
      data.push( `${ this.name() }: ${ transition.from } => ${ transition.to }` );
    } );
    piggy.logger.info( label, ...data );
    return this;
  }
}
