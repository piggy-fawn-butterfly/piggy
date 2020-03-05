import { constants } from "../../Const/Constant";
import { enums } from "../../Const/Declare/Enums";
import { states } from "../../Const/States";
import { strings } from "../../Utils/Strings";
import { events } from "../Events";
import { fsm } from "../FiniteStateMachine";
import { i18n } from "../i18n";
import { logger } from "../Logger";
import { machines } from "../Machines";
import { res } from "../Res";
import { sound } from "../Sound";
import { tick } from "../Tick";
import { timers } from "../Timers";
import { userdata } from "../Userdata";
import { assets } from "../../Const/Assets";
import { layers } from "./Layers";

/**
 * App启动前需要进行的配置
 */
cc.macro.ENABLE_TRANSPARENT_CANVAS = true;

const { ccclass, property, disallowMultiple, requireComponent } = cc._decorator;

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
@disallowMultiple
@requireComponent(cc.Canvas)
abstract class App extends cc.Component {
  //----------------------组件属性----------------------

  resetInEditor() {
    this.resetEditor();
    this._p_version_string = constants.VERSION_STRING;
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
  public m_app_fsm: fsm.StateMachine;

  /**
   * 初始化
   */
  private resetEditor() {
    this.lockCanvasAdapter();
  }

  //----------------------组件方法----------------------

  /**
   * App首次加载
   */
  onLoad() {
    //全局禁用抗锯齿，部分需要的开启抗锯齿
    cc.view.enableAntiAlias(false);

    //设置语言
    i18n.I.language = this._p_i18n_language;

    //设置日志等级
    let level = this.isRelease()
      ? enums.E_Log_Level.Error
      : enums.E_Log_Level.Trace;
    logger.setLevel(level);

    //创建游戏状态机
    machines.create(states.app).then(async machine => {
      logger.info(`[FSM] ${machine.m_category}: ${machine.current()}`);
      this.m_app_fsm = machine;
      await this.onAppInit();
      this.m_app_fsm.transitTo(states.app.transition.start);
    });
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
   * 是否开发、测试、发布版本
   */
  isDev(): boolean {
    return this.p_version_state === enums.E_Version_Choice.Dev;
  }
  isBeta(): boolean {
    return this.p_version_state === enums.E_Version_Choice.Beta;
  }
  isRelease(): boolean {
    return this.p_version_state === enums.E_Version_Choice.Release;
  }

  /**
   * 获得离线时间
   */
  public getOfflineTime(): number {
    return (this.m_enter_at - this.m_exit_at) / constants.SEC_TO_MS;
  }

  /**
   * App销毁
   */
  onDestroy() {
    this.unregisterEventListener();
  }

  /**
   * 游戏初始化
   */
  async onAppInit(): Promise<void> {
    return new Promise(async resolve => {
      //锁定Canvas适配方案
      this.lockCanvasAdapter();

      //模块初始化
      userdata.init();
      res.init();
      sound.init();

      //注册事件
      this.registerEventListener();

      //预先挂载背景层、资源加载层和调试信息层
      let resources = [
        assets.Prefab_BackgroundLayer,
        assets.Prefab_LoadingLayer
      ];
      await res.load(resources);
      await layers.open(assets.Prefab_BackgroundLayer);
      await layers.open(assets.Prefab_LoadingLayer);
      resolve();
    });
  }

  /**
   * 游戏开始
   */
  async onAppStart(): Promise<void> {
    await this.onStart();
    tick.start();
    this.dump();
  }
  public abstract async onStart(): Promise<void>;

  /**
   * 输出App信息
   */
  public dump() {
    machines.dump();
    userdata.dump();
    res.dump();
    sound.dump();
    timers.dump();
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
   * 开始处理
   */
  onDealWithAppStart(): Promise<void> {
    return new Promise(resolve => {
      this.onAppStart();
      resolve();
    });
  }

  /**
   * 作弊处理
   */
  onDealWithAppCheat(): Promise<void> {
    return new Promise(resolve => {
      //TODO
      resolve();
    });
  }

  /**
   * 重置处理
   */
  onDealWithAppReset(): Promise<void> {
    return new Promise(async resolve => {
      layers.closeAll();
      this.unregisterEventListener();
      userdata.save();
      tick.reset();
      timers.del();
      sound.stop();
      events.reset();
      this.registerEventListener();
      this.m_app_fsm.transitTo(states.app.transition.start);
      resolve();
    });
  }

  /**
   * 重启处理
   */
  onDealWithAppRestart(): Promise<void> {
    return new Promise(async resolve => {
      //TODO
      resolve();
    });
  }

  /**
   * 暂停处理
   */
  onDealWithAppPause(): Promise<void> {
    return new Promise(resolve => {
      userdata.save();
      sound.pause();
      tick.timer().interrupt();
      resolve();
    });
  }

  /**
   * 恢复处理
   */
  onDealWithAppResume(): Promise<void> {
    return new Promise(resolve => {
      sound.resume();
      tick.timer().recover();
      resolve();
    });
  }

  /**
   * 结束处理
   */
  onDealWithAppOver(): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  }

  /**
   * 处理状态机状态切换事件
   * @param event 状态切换事件
   */
  private async onFsmTransitTo(event: cc.Event.EventCustom): Promise<any> {
    let { name, from, to } = <fsm.I_FSM_TRANSITION>event.getUserData();
    logger.info(`[FSM] ${event.type}: ${from} > ${to}`);
    let machine = machines.get(event.type);
    if (machine && states[machine.name()]) {
      let transition = name.split("_").pop();
      let api = this[`onDealWithApp${strings.capitalize(transition)}`];
      await (api && api instanceof Function && api.apply(this));
    }
  }

  /**
   * 监听事件
   */
  registerEventListener() {
    const { ON_APP_SHOW, ON_APP_HIDE, ON_CANVAS_RESIZE } = constants.EVENT_NAME;

    //监听系统进入、退出事件
    cc.game.on(ON_APP_SHOW, this.onAppShow, this);
    cc.game.on(ON_APP_HIDE, this.onAppHide, this);

    //监听App状态机事件
    events.on(this.m_app_fsm.m_category, this.onFsmTransitTo, this);

    //监听Canvas尺寸变化事件
    if (this.p_auto_resize_for_browser && cc.sys.isBrowser) {
      cc.view.enableAutoFullScreen(this.p_auto_resize_for_browser);
      let toolbar = document.getElementsByClassName("toolbar")[0];
      toolbar && (toolbar["style"]["display"] = "none");
      this.schedule(this.refreshFrameSize, 1);
      return this.refreshFrameSize();
    }
    cc.view.on(ON_CANVAS_RESIZE, this.onCanvasResize, this);
  }

  /**
   * 注销事件
   */
  unregisterEventListener() {
    const { ON_APP_SHOW, ON_APP_HIDE, ON_CANVAS_RESIZE } = constants.EVENT_NAME;
    cc.game.off(ON_APP_SHOW, this.onAppShow, this);
    cc.game.off(ON_APP_HIDE, this.onAppHide, this);
    events.off(this.m_app_fsm.m_category, this.onFsmTransitTo, this);
    if (this.p_auto_resize_for_browser && cc.sys.isBrowser) {
      return this.unschedule(this.refreshFrameSize);
    }
    cc.view.off(ON_CANVAS_RESIZE, this.onCanvasResize, this);
    events.targetOff(this);
  }

  /**
   * Canvas尺寸变化事件
   */
  onCanvasResize() {
    events.dispatch(constants.EVENT_NAME.ON_CANVAS_RESIZE);
  }

  /**
   * App进入前台事件
   */
  public onAppShow() {
    logger.info(i18n.I.text(i18n.K.app_entering));
    this.m_enter_at = Date.now();
    let time = this.getOfflineTime();
    let info = i18n.I.text(i18n.K.app_offline_time);
    logger.info(strings.render(info, { time: time }));
    let { reset, resume } = states.app.transition;
    let state = time >= constants.OFFLINE_TO_RESTART ? reset : resume;
    this.m_app_fsm.transitTo(state);
    logger.info(i18n.I.text(i18n.K.app_entered));
  }

  /**
   * App进入后台事件
   */
  onAppHide() {
    logger.info(i18n.I.text(i18n.K.app_exiting));
    this.m_exit_at = Date.now();
    this.m_app_fsm.transitTo(states.app.transition.pause);
    logger.info(i18n.I.text(i18n.K.app_exited));
  }

  /**
   * 是否已经全屏
   */
  public isFullScreen() {
    return cc.screen["fullScreen"]();
  }

  /**
   * 请求全屏
   */
  public enterFullScreen(element?: Element) {
    if (cc.screen["fullScreen"]()) return;
    cc.screen["requestFullScreen"](
      element || cc.game.container,
      this.onEnterFullScreenOK.bind(this),
      this.onEnterFullScreenFailed.bind(this)
    );
  }

  /**
   * 进入全屏成功回调
   */
  onEnterFullScreenOK(e: any) {
    logger.info("onEnterFullScreenOK:", e);
  }

  /**
   * 进入全屏失败回调
   */
  onEnterFullScreenFailed(e: any) {
    logger.info("onEnterFullScreenFailed:", e);
  }

  /**
   * 退出全屏回调
   */
  onExitFullScreen(e: any) {
    logger.info("onExitFullScreen:", e);
  }

  /**
   * 退出全屏
   */
  public exitFullScreen(element?: Element) {
    if (!cc.screen["fullScreen"]()) return;
    cc.screen["exitFullScreen"](
      element || cc.game.container,
      this.onExitFullScreen.bind(this)
    );
  }
}

export { App as app };
