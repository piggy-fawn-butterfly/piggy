/**
 * @file enums
 * @description 枚举定义
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export const enums = {
  /**
   * 开发模式
   */
  E_Dev_Mode: cc.Enum({
    Debug: 0,
    Beta: 1,
    Release: 2
  }),

  /**
   * 国际化选项
   * - SC: 简体中文
   * - TC: 繁体中文
   * - EN: 英文
   * - JP: 日文
   * - KR: 韩文
   * - FR: 法文
   */
  E_Language_Choice: cc.Enum({
    SC: 0, //简体中文
    TC: 1, //繁体中文
    EN: 2, //英文
    JP: 3, //日文
    KR: 4, //韩文
    FR: 5, //法文
    ES: 6 //西文
  }),

  /**
   * 版本选项
   * - Dev: 开发
   * - Beta: 测试
   * - Release: 发布
   */
  E_Version_Choice: cc.Enum({
    Dev: 0,
    Beta: 1,
    Release: 2
  }),

  /**
   * 日志等级枚举
   */
  E_Log_Level: cc.Enum({
    Trace: 0,
    Info: 1,
    Warn: 2,
    Error: 3,
    Silence: 4
  }),

  /**
   * 日志方法
   */
  E_Log_Method: cc.Enum({
    Trace: "trace",
    Info: "log",
    Warn: "warn",
    Error: "error"
  }),

  /**
   * 音频类型
   */
  E_Sound_Type: cc.Enum({
    Music: "music",
    Effect: "effect"
  }),

  /**
   * 视图类型
   * @summary 枚举值代表基础层级
   * - 背景视图根据当前打开的视图会自动更新层级，可根据需求调整穿透
   * - 除背景视图外，全屏窗口一定位于最底层或次底层，禁止穿透，无关闭或返回
   * - 停靠视图根据停靠对象，其层级会加上停靠对象的层级，外部可穿透，内部不可穿透，可选关闭
   * - 模态窗口处于全屏窗口之上，禁止穿透，可设置区域外关闭，必定有关闭或返回
   * - 消息框处于模态视图之上，禁止穿透，可设置区域外关闭，必定有关闭或返回
   * - 加载视图处于消息框之上，禁止穿透，无关闭或返回
   * - 消息文本处于加载视图之上，可穿透，无关闭或返回
   * - 调试信息一定位于最高层，无关闭或返回
   */
  E_Layer_Type: cc.Enum({
    Background: 0,
    Screen: 1,
    Dock: 2,
    Modal: 200,
    MsgBox: 300,
    Loading: 400,
    MsgText: 500,
    Cheat: 998,
    Debug: 999
  }),

  /**
   * 定时器状态
   */
  E_Timer_State: cc.Enum({
    Ready: "ready",
    Running: "running",
    Paused: "paused",
    Stopped: "stopped"
  }),

  /**
   * 定时器导出API
   */
  E_Timer_API: cc.Enum({
    isInterrupt: "isInterrupt",
    isRunning: "isRunning",
    isPaused: "isPaused",
    isStopped: "isStopped",
    interrupt: "interrupt",
    recover: "recover",
    pause: "pause",
    restart: "restart",
    stop: "stop",
    resume: "resume"
  }),

  /**
   * HTTP Methods
   */
  E_Http_Method: cc.Enum({
    Get: "GET",
    Post: "POST"
  })
};
