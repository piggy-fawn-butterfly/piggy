import { res } from "./Res";
import { i18n } from "./i18n";
import { logger } from "./Logger";
import { userdata } from "./Userdata";
import { strings } from "../Utils/Strings";
import { constants } from "../Const/Constant";
import { enums } from "../Const/Declare/Enums";
import { interfaces } from "../Const/Declare/Interfaces";

/**
 * @file Sound
 * @description 音频管理器
 * @requires
 *  - `Res`
 *  - `Userdata`
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
class Sound {
  public static s_instance: Sound = new Sound();
  private m_volume: number;
  private m_music_on: boolean;
  private m_caches: Map<string, interfaces.I_Sound_Info>;

  /**
   * 隐藏构造器
   */
  private constructor() {
    this.m_caches = new Map();
    this.m_music_on = true;
    this.m_volume = 1.0;
  }

  /**
   * 初始化音频管理器
   */
  public init() {
    this.setVolume(userdata.m_raw_schemas.sound.volume.val);
    this.switchMusic(userdata.m_raw_schemas.sound.music.val);
  }

  /**
   * 音频是否正在播放
   * @param path 路径
   */
  public isPlaying(path: string) {
    return this.getState(path) === cc.audioEngine.AudioState.PLAYING;
  }

  /**
   * 设置音乐开关
   * @param state 音乐开关
   */
  public switchMusic(state: boolean) {
    if (typeof state === "boolean") return;
    this.m_music_on = state;
    !this.m_music_on && this.setVolume(0);
    userdata.m_raw_schemas.sound.music.val = this.m_music_on;
  }

  /**
   * 检查音量
   * @param volume 音量
   */
  _checkVolume(volume: number): number {
    let { MAX, MIN } = constants.VOLUME_VALUE;
    return Math.min(MAX, Math.max(MIN, volume)) / MAX;
  }

  /**
   * 设置音量
   * @param volume 音量`0~100`
   */
  public setVolume(volume: number) {
    if (this.m_volume === volume) return;
    this.m_volume = this._checkVolume(volume);
    this.m_caches.forEach(sound => {
      cc.audioEngine.setVolume(sound.audio, this.m_volume);
    });
    userdata.m_raw_schemas.sound.volume.val =
      this.m_volume * constants.VOLUME_VALUE.MAX;
  }

  /**
   * 卸载音频资源
   * @param path 名称
   */
  public unload(path: string) {
    this.stop(path);
    res.unload(path);
  }

  /**
   * 播放音频
   * @param path 路径
   * @param loop 循环
   * @param music 是否音乐类型
   */
  public async play(path: string, loop: boolean, music?: boolean) {
    if (!path || !res.isTypeOf(path, "cc.AudioClip")) {
      return logger.error(i18n.I.text(i18n.K.audio_resource_no_found), path);
    }
    await res.load([path]).then(async () => {
      let clip: cc.AudioClip = await res.use(path);
      let audio = cc.audioEngine.play(clip, loop, music ? this.m_volume : 1.0);
      let type = music ? enums.E_Sound_Type.Music : enums.E_Sound_Type.Effect;
      this.m_caches.set(path, { audio: audio, type: type });
      if (!loop) {
        cc.audioEngine.setFinishCallback(audio, () => {
          this.stop(path);
        });
      }
    });
  }

  /**
   * 播放音乐
   * @param path 路径
   * @param loop 循环
   */
  public playMusic(path: string, loop: boolean) {
    this.play(path, loop, true);
  }

  /**
   * 是否在播放列表中
   * @param path 路径
   */
  public has(path: string) {
    return this.m_caches.has(path);
  }

  /**
   * 暂停指定音频，不填具体路径作用于全部音频
   * @param path 音频路径
   */
  public pause(path?: string) {
    if (!path) return cc.audioEngine.pauseAll();
    if (this.has(path)) cc.audioEngine.pause(this.m_caches.get(path).audio);
  }

  /**
   * 恢复指定音频，不填具体路径作用于全部音频
   * @param path 音频路径
   */
  public resume(path?: string) {
    if (!path) return cc.audioEngine.resumeAll();
    if (this.has(path)) cc.audioEngine.resume(this.m_caches.get(path).audio);
  }

  /**
   * 停止指定音频，不指定具体路径则作用于全部音频
   * @param path 音频路径
   */
  public stop(path?: string) {
    if (!path) {
      cc.audioEngine.stopAll();
      this.m_caches.clear();
      return;
    }
    if (this.has(path)) {
      cc.audioEngine.stop(this.m_caches.get(path).audio);
      this.m_caches.delete(path);
    }
  }

  /**
   * 获得音频状态
   * @returns cc.audioEngine.AudioState
   */
  public getState(path: string): cc.audioEngine.AudioState {
    if (!this.has(path)) return cc.audioEngine.AudioState.ERROR;
    return cc.audioEngine.getState(this.m_caches.get(path).audio);
  }

  /**
   * 输出信息
   */
  public dump() {
    let data = [i18n.I.text(i18n.K.audio_volume) + this.m_volume];
    this.m_caches.forEach((sound, path) => {
      let state = this.getState(path);
      let context = { path: path, type: sound.type, state: state };
      data.push(strings.render(i18n.I.text(i18n.K.audio_information), context));
    });
    logger.info(i18n.I.text(i18n.K.audio_all_information), ...data);
  }
}

export const sound: Sound = Sound.s_instance;
