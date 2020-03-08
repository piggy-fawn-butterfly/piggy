import { logger } from "../Logger";
import { events } from "../Events";
import { constants } from "../../Const/Constant";
import { httpClient } from "../Network/HttpClient";
import { interfaces } from "../../Const/Declare/Interfaces";

/**
 * @file Wechat
 * @description 微信辅助工具
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
class Wechat {
  /**
   * 构造器
   */
  constructor() {
    this._init();
  }

  /**
   * 是否微信平台
   */
  public isWechat() {
    return cc.sys.platform === cc.sys.WECHAT_GAME;
  }

  /**
   * 小游戏退出
   * @param code 退出原因
   */
  public exit(code?: string) {
    if (!this.isWechat()) return;
    wx.exitMiniProgram({
      success(res) {
        logger.warn("@小游戏退出", code || "");
      }
    });
  }

  /**
   * 添加游戏圈悬浮按钮
   * @param style 游戏圈按钮样式
   */
  public addGameClub(
    theme: "light" | "dark" | "green" | "white",
    style?: WechatMinigame.CreateGameClubButtonOptionStyle
  ) {
    if (!this.isWechat()) return;
    style = style || this._getGameClubButtonDefaultStyle();
    wx.createGameClubButton({
      type: "image",
      style: style,
      icon: theme
    });
  }

  /**
   * 默认游戏圈风格
   */
  private _getGameClubButtonDefaultStyle(): WechatMinigame.CreateGameClubButtonOptionStyle {
    let rect = wx.getMenuButtonBoundingClientRect();
    return {
      backgroundColor: "#fff",
      borderColor: "#fff",
      borderWidth: 0,
      borderRadius: 0,
      color: "#000",
      textAlign: "center",
      fontSize: 18,
      lineHeight: 32,
      left: rect.width - 32,
      top: rect.top + rect.height,
      width: 32,
      height: 32
    };
  }

  /**
   * 初始化
   */
  private _init() {
    if (!this.isWechat()) return;
    wx.onShow(res => this._onShow(res));
    wx.onHide(res => this._onHide(res));
  }

  /**
   * 小游戏进入前台
   * @param res
   */
  private _onShow(res: WechatMinigame.OnShowCallbackResult) {
    cc.game.emit(constants.EVENT_NAME.ON_APP_SHOW);
    //TODO
  }

  /**
   * 小游戏进入后台
   * @param res
   */
  private _onHide(res: WechatMinigame.GeneralCallbackResult) {
    cc.game.emit(constants.EVENT_NAME.ON_APP_HIDE);
    //TODO
  }

  /**
   * 是否移动平台
   */
  private _isMobile() {
    let os = wx.getSystemInfoSync().platform.toLowerCase();
    return os === "ios" || os === "android";
  }

  /**
   * 检查WIFI状态
   */
  public checkWifi() {
    if (!this.isWechat()) return;
    if (!this._isMobile()) return;
    let self = this;
    wx.showModal({
      title: "温馨提示",
      content: "当前没有连接WiFi，是否继续？",
      success(res: WechatMinigame.ShowModalSuccessCallbackResult) {
        if (res.confirm) return self._onAcceptWiFi();
        if (res.cancel) return self._onRejectWiFi();
      }
    });
  }

  /**
   * 接受没有WiFi的情况
   */
  _onAcceptWiFi() {
    //TODO
  }

  /**
   * 拒绝没有WiFi的情况
   */
  _onRejectWiFi() {
    if (!this.isWechat()) return;
    this.exit("拒绝无WiFi情况");
  }

  /**
   * 添加授权按钮
   */
  public addAuthButton() {
    if (!this.isWechat()) return;

    let self = this;
    let system = wx.getSystemInfoSync();
    let btn = wx.createUserInfoButton({
      type: "text",
      text: "",
      style: {
        textAlign: "center",
        left: 0,
        top: 0,
        width: system.windowWidth,
        height: system.windowHeight,
        backgroundColor: "#ccaa77",
        borderColor: "#5c5c5c",
        color: "#5c5c5c",
        fontSize: 32,
        borderWidth: 4,
        borderRadius: 0,
        lineHeight: 36
      },
      withCredentials: true
    });

    btn.onTap(res => {
      if (res.userInfo) {
        btn.destroy();
        self.getOpenId();
        return;
      }
      wx.showModal({
        title: "温馨提示",
        content: "为提升您的游戏体验，我们需要您的授权",
        success() {}
      });
    });

    btn.show();
  }

  /**
   * 获取OpenId
   */
  public getOpenId() {
    if (!this.isWechat()) return;
    let self = this;
    wx.checkSession({
      success(res) {
        let session = wx.getStorageSync("session");
        if (!session) {
          self.reLogin();
          return;
        }
        self._once();
        httpClient.getInstance().get(constants.SERVER_API.CHECK_SESSION_WX, {
          session: session
        });
      }
    });
  }

  /**
   * 监听网络时间
   */
  private _once() {
    events.once(
      constants.SERVER_API.CHECK_SESSION_WX,
      this.accountLogin.bind(this),
      this
    );
  }

  public accountLogin(data: interfaces.I_Simple_Object) {
    if (data && data.msg && data.msg.session) {
      wx.setStorageSync("session", data.msg.session);
      wx.getUserInfo({
        withCredentials: true,
        success(res) {}
      });
      return;
    }
    logger.error("小游戏登录失败");
  }

  /**
   * 微信登录
   */
  public login() {
    if (!this.isWechat()) return;

    let self = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          logger.info("已授权微信小游戏");
          self.getOpenId();
          return;
        }
        logger.info("未授权微信小游戏，创建授权按钮，等待用户授权");
        self.addAuthButton();
      }
    });
  }

  /**
   * 重新登录
   */
  reLogin() {}
}

export { Wechat as wechat };
