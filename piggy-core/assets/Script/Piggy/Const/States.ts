/**
 * @file States
 * @description 状态机状态配置
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
export const states = {
  /**
   * 游戏状态机配置
   */
  game: {
    transition: {
      start: "game_start",
      pause: "game_pause",
      resume: "game_resume",
      over: "game_over",
      cheat: "game_cheat",
      reset: "game_reset",
      restart: "game_restart"
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
        { name: "game_start", from: "ready", to: "running" },
        { name: "game_pause", from: "running", to: "paused" },
        { name: "game_resume", from: "paused", to: "running" },
        { name: "game_over", from: "running", to: "stopped" },
        { name: "game_cheat", from: "ready", to: "ready" },
        { name: "game_cheat", from: "running", to: "ready" },
        { name: "game_cheat", from: "paused", to: "ready" },
        { name: "game_cheat", from: "stopped", to: "ready" },
        { name: "game_reset", from: "paused", to: "ready" },
        { name: "game_reset", from: "stopped", to: "ready" },
        { name: "game_restart", from: "stopped", to: "running" }
      ]
    }
  }
};
