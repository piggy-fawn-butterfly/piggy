/**
 * @file states
 * @description 状态配置
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export const states = {
  /**
   * 游戏状态机配置
   */
  app: {
    name: "app",
    transition: {
      start: "tr_app_start",
      pause: "tr_app_pause",
      resume: "tr_app_resume",
      over: "tr_app_over",
      cheat: "tr_app_cheat",
      reset: "tr_app_reset",
      restart: "tr_app_restart"
    },
    state: {
      ready: "ready",
      running: "running",
      paused: "paused",
      stopped: "stopped"
    },
    structure: {
      default_state: "ready",
      states: ["ready", "running", "paused", "stopped"],
      transitions: [
        { name: "tr_app_start", from: "ready", to: "running" },
        { name: "tr_app_pause", from: "running", to: "paused" },
        { name: "tr_app_resume", from: "paused", to: "running" },
        { name: "tr_app_over", from: "running", to: "stopped" },
        { name: "tr_app_cheat", from: "ready", to: "ready" },
        { name: "tr_app_cheat", from: "running", to: "ready" },
        { name: "tr_app_cheat", from: "paused", to: "ready" },
        { name: "tr_app_cheat", from: "stopped", to: "ready" },
        { name: "tr_app_reset", from: "paused", to: "ready" },
        { name: "tr_app_reset", from: "stopped", to: "ready" },
        { name: "tr_app_restart", from: "stopped", to: "running" }
      ]
    }
  }
};
