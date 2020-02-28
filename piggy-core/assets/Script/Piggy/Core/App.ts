import { res } from "./Res";
import { i18n } from "./i18n";
import { sound } from "./Sound";
import { logger } from "./Logger";
import { events } from "./Events";
import { timers } from "./Timers";
import { userdata } from "./Userdata";
import { states } from "../Const/States";
import { assets } from "../Const/Assets";
import { strings } from "../Utils/Strings";
import { fsm } from "./FiniteStateMachine";
import { constants } from "../Const/Constant";
import { enums } from "../Const/Declare/Enums";

const {
  ccclass,
  property,
  playOnFocus,
  disallowMultiple,
  executeInEditMode,
  requireComponent
} = cc._decorator;

/**
 * @file App
 * @description 游戏入口组件
 * @requires cc.Canvas
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
@ccclass
@playOnFocus
@disallowMultiple
@executeInEditMode
@requireComponent(cc.Canvas)
abstract class App extends cc.Component {
  //----------------------组件属性----------------------

  resetInEditor() {
    this.resetEditor();
    this._p_version_string = constants.VERSION_STRING;
  }
  onFocusInEditor() {
    this.resetEditor();
  }
  onLostFocusInEditor() {
    this.resetEditor();
  }
  onRestore() {
    this.resetEditor();
  }

  /**
   * 选择语言
   */
  @property()
  _p_i18n_language: enums.E_Language_Choice = enums.E_Language_Choice.CN;
  @property({
    displayName: i18n.I.text(i18n.K.editor_choose_language),
    type: cc.Enum(enums.E_Language_Choice)
  })
  get p_i18n_language(): enums.E_Language_Choice {
    return this._p_i18n_language;
  }
  set p_i18n_language(lang: enums.E_Language_Choice) {
    i18n.I.language = this._p_i18n_language = lang;
  }

  /**
   * 版本号
   * @summary 规则:
   * - 结构: 主版本号.次版本号.小版本号
   * - 版本号必须是非负整数
   */
  @property()
  _p_version_string: string = constants.VERSION_STRING;
  @property({
    displayName: i18n.I.text(i18n.K.editor_version_code),
    type: cc.String
  })
  get p_version_string(): string {
    return this._p_version_string;
  }
  set p_version_string(str: string) {
    let arr = str.split(".");
    if (arr.length !== 3) {
      cc.warn(i18n.I.text(i18n.K.editor_invalid_version_rule));
      this.p_version_string = constants.VERSION_STRING;
    } else {
      let ret = [];
      arr.forEach(code => {
        let num = Number(code);
        let meet = !isNaN(num) && num >= 0 && code[0] !== "-";
        num = meet ? num : 0;
        !meet && cc.warn(i18n.I.text(i18n.K.editor_invalid_version_number));
        ret.push(num);
      });
      this._p_version_string = ret.join(".");
    }
  }

  /**
   * 版本状态
   */
  @property({
    displayName: i18n.I.text(i18n.K.editor_version_state),
    type: cc.Enum(enums.E_Version_Choice)
  })
  p_version_state: enums.E_Version_Choice = enums.E_Version_Choice.Dev;

  /**
   * 浏览器自动满屏
   */
  @property({
    displayName: i18n.I.text(i18n.K.editor_auto_resize_for_browser),
    tooltip: i18n.I.text(i18n.K.editor_browser_only)
  })
  p_auto_resize_for_browser: boolean = false;

  /**
   * 应用进入前台时间
   */
  private m_enter_at: number;
  /**
   * 应用进入后台时间
   */
  private m_exit_at: number;
  /**
   * 游戏状态机
   */
  public m_game_fsm: fsm.StateMachine;
  //----------------------组件方法----------------------

  /**
   * 初始化
   */
  private resetEditor() {
    this.lockCanvasAdapter();
  }

  /**
   * 锁定Canvas适配
   * 采用新的屏幕适配方案：SHOW_ALL + CanvasAdapter
   * @see {@link CanvasAdapter} for further information.
   * @see CanvasAdapter
   */
  private lockCanvasAdapter() {
    let canvas = this.node.getComponent(cc.Canvas);
    canvas.fitWidth = true;
    canvas.fitHeight = true;
  }

  /**
   * 是否开发版本
   */
  isDev() {
    return this.p_version_state === enums.E_Version_Choice.Dev;
  }

  /**
   * 是否测试版本
   */
  isBeta() {
    return this.p_version_state === enums.E_Version_Choice.Beta;
  }

  /**
   * 是否发布版本
   */
  isRelease() {
    return this.p_version_state === enums.E_Version_Choice.Release;
  }

  /**
   * App首次加载
   */
  onLoad() {
    //设置日志等级
    let level = this.isRelease()
      ? enums.E_Log_Level.Error
      : enums.E_Log_Level.Trace;
    logger.setLevel(level);

    //设置语言
    i18n.I.language = this._p_i18n_language;

    //创建游戏状态机
    fsm.create(states.game.structure).then(machine => {
      (this.m_game_fsm = machine).dump();
      machine.m_category;
      logger.info(`[FSM] ${machine.m_category}: ${machine.current()}`);
      this.onAppInit();
    });
  }

  /**
   * App销毁
   */
  onDestroy() {
    this.unschedule(this.refreshFrameSize);
  }

  /**
   * 游戏初始化
   */
  onAppInit() {
    //模块初始化
    userdata.init();
    res.init();
    sound.init();

    //锁定Canvas适配方案
    this.lockCanvasAdapter();

    //注册事件
    this.registerEventListener();
    this.registerCanvasResizeEvent();
    this.registerFiniteStateMachine();

    //启动状态机
    this.m_game_fsm.transitTo(states.game.transition.start);
  }

  /**
   * 游戏开始
   */
  onAppStart() {
    this.onStart();
  }
  public abstract onStart(): void;

  /**
   * 监听Canvas尺寸变化
   */
  registerCanvasResizeEvent() {
    if (this.p_auto_resize_for_browser && cc.sys.isBrowser) {
      cc.view.enableAutoFullScreen(this.p_auto_resize_for_browser);
      let toolbar = document.getElementsByClassName("toolbar")[0];
      toolbar && (toolbar["style"]["display"] = "none");
      this.schedule(this.refreshFrameSize, 1);
      this.refreshFrameSize();
    } else {
      cc.view.on(constants.EVENT_NAME.ON_CANVAS_RESIZE, () => {
        events.dispatch(constants.EVENT_NAME.ON_CANVAS_RESIZE);
      });
    }
  }

  /**
   * 自动更新FrameSize
   */
  refreshFrameSize() {
    let frameSize = cc.view.getFrameSize();
    let { clientWidth, clientHeight } = document.body;
    if (
      Math.floor(frameSize.width - clientWidth) !== 0 ||
      Math.floor(frameSize.height - clientHeight) !== 0
    ) {
      cc.view.setFrameSize(clientWidth, clientHeight);
      events.dispatch(constants.EVENT_NAME.ON_CANVAS_RESIZE);
    }
  }

  /**
   * 注册游戏状态机监听器
   */
  registerFiniteStateMachine() {
    states.game.structure.transitions.forEach(transition => {
      events.on(transition.name, this.onFsmTransitTo, this);
    });
  }

  /**
   * 游戏作弊处理
   */
  onDealWithGameCheat() {}

  /**
   *
   * @param event
   */
  onFsmTransitTo(event: cc.Event.EventCustom) {
    let { name, from, to } = <fsm.I_FSM_TRANSITION>event.getUserData();
    logger.info(`[FSM] ${name}: ${from} > ${to}`);
    switch (name) {
      case states.game.transition.cheat:
        this.onDealWithGameCheat();
        break;
      case states.game.transition.reset:
        events.reset();
        // UIStack.I.closeAll();
        timers.del();
        sound.stop();
        // GameTimeCounter.I.reset();
        this.registerFiniteStateMachine();
        this.onAppStart();
        break;
      case states.game.transition.start:
        this.onAppStart();
        sound.playMusic(assets.Sound_LoopingBgm1, true);
        sound.dump();
        break;
      case states.game.transition.restart:
        this.onAppStart();
        break;
      case states.game.transition.pause:
        timers.interrupt();
        userdata.save();
        break;
      case states.game.transition.over:
        break;
      case states.game.transition.resume:
        timers.recover();
        break;
      default:
        break;
    }
  }

  /**
   * 监听系统事件
   */
  registerEventListener() {
    cc.game.on(constants.EVENT_NAME.ON_APP_SHOW, this.onAppShow, this);
    cc.game.on(constants.EVENT_NAME.ON_APP_HIDE, this.onAppHide, this);
  }

  /**
   * 获得离线时间
   */
  getOfflineTime(): number {
    return (this.m_enter_at - this.m_exit_at) / 1000;
  }

  /**
   * App进入前台事件
   */
  onAppShow() {
    logger.info(i18n.I.text(i18n.K.app_entering));
    this.m_enter_at = Date.now();
    let time = this.getOfflineTime();
    let info = i18n.I.text(i18n.K.app_offline_time);
    logger.info(strings.render(info, { time: time }));
    let state =
      time >= constants.OFFLINE_TO_RESTART
        ? states.game.transition.reset
        : states.game.transition.resume;
    this.m_game_fsm.transitTo(state);
    logger.info(i18n.I.text(i18n.K.app_entered));
  }

  /**
   * App进入后台事件
   */
  onAppHide() {
    logger.info(i18n.I.text(i18n.K.app_exiting));
    this.m_exit_at = Date.now();
    this.m_game_fsm.transitTo(states.game.transition.pause);
    logger.info(i18n.I.text(i18n.K.app_exited));
  }
}

export { App as app };
