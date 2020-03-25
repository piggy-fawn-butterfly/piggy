/**
 * @file Sound
 * @description 音频管理器
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
class Sound {
  /**
   * 隐藏构造器
   */
  constructor() {
    this.m_caches = new Map();
    this.m_music_on = true;
    this.m_volume = 1.0;
  }

  /**
   * 初始化音频管理器
   */
  init() {
    this.setVolume( piggy.userdata.m_raw_schemas.sound.volume.val );
    this.switchMusic( piggy.userdata.m_raw_schemas.sound.music.val );
  }

  /**
   * 音频是否正在播放
   * @param {string} path 路径
   * @returns {boolean}
   */
  isPlaying( path ) {
    return this.getState( path ) === cc.audioEngine.AudioState.PLAYING;
  }

  /**
   * 设置音乐开关
   * @param {boolean} state 音乐开关
   */
  switchMusic( state ) {
    if ( typeof state === "boolean" ) return;
    this.m_music_on = state;
    !this.m_music_on && this.setVolume( 0 );
    piggy.userdata.m_raw_schemas.sound.music.val = this.m_music_on;
  }

  /**
   * 检查音量
   * @param {number} volume 音量
   * @returns {number}
   */
  _checkVolume( volume ) {
    let { MAX, MIN } = piggy.constants.VOLUME_VALUE;
    return Math.min( MAX, Math.max( MIN, volume ) ) / MAX;
  }

  /**
   * 设置音量
   * @param {number} volume 音量`0~100`
   */
  setVolume( volume ) {
    if ( this.m_volume === volume ) return;
    this.m_volume = this._checkVolume( volume );
    this.m_caches.forEach( sound => {
      cc.audioEngine.setVolume( sound.audio, this.m_volume );
    } );
    piggy.userdata.m_raw_schemas.sound.volume.val =
      this.m_volume * piggy.constants.VOLUME_VALUE.MAX;
  }

  /**
   * 卸载音频资源
   * @param {string} path 名称
   */
  unload( path ) {
    this.stop( path );
    piggy.res.unload( path );
  }

  /**
   * 播放音频
   * @param {string} path 路径
   * @param {boolean} loop 循环
   * @param {boolean} music 是否音乐类型
   */
  play( path, loop, music ) {
    if ( !path || !piggy.res.isTypeOf( path, "cc.AudioClip" ) ) {
      return piggy.logger.error( piggy.i18n.t( piggy.i18nK.audio_resource_no_found ), path );
    }
    piggy.res.load( [ path ], null, () => {
      let clip = piggy.res.use( path );
      if ( clip instanceof cc.AudioClip ) {
        let audio = cc.audioEngine.play( clip, loop, music ? this.m_volume : 1.0 );
        let type = music ? piggy.enums.E_Sound_Type.Music : piggy.enums.E_Sound_Type.Effect;
        this.m_caches.set( path, { audio: audio, type: type } );
        !loop && cc.audioEngine.setFinishCallback( audio, () => {
          this.stop( path );
        } );
      }
    } );
  }

  /**
   * 播放音乐
   * @param {string} path 路径
   * @param {boolean} loop 循环
   */
  playMusic( path, loop ) {
    this.play( path, loop, true );
  }

  /**
   * 是否在播放列表中
   * @param {string} path 路径
   * @returns {boolean}
   */
  has( path ) {
    return this.m_caches.has( path );
  }

  /**
   * 暂停指定音频，不填具体路径作用于全部音频
   * @param {string} path 音频路径
   */
  pause( path ) {
    if ( !path ) return cc.audioEngine.pauseAll();
    if ( this.has( path ) ) cc.audioEngine.pause( this.m_caches.get( path ).audio );
  }

  /**
   * 恢复指定音频，不填具体路径作用于全部音频
   * @param {string} path 音频路径
   */
  resume( path ) {
    if ( !path ) return cc.audioEngine.resumeAll();
    if ( this.has( path ) ) cc.audioEngine.resume( this.m_caches.get( path ).audio );
  }

  /**
   * 停止指定音频，不指定具体路径则作用于全部音频
   * @param {string} path 音频路径
   */
  stop( path ) {
    if ( !path ) {
      cc.audioEngine.stopAll();
      this.m_caches.clear();
      return;
    }
    if ( this.has( path ) ) {
      cc.audioEngine.stop( this.m_caches.get( path ).audio );
      this.m_caches.delete( path );
    }
  }

  /**
   * 获得音频状态
   * @param {string} path
   * @returns {cc.audioEngine.AudioState | number}
   */
  getState( path ) {
    if ( !this.has( path ) ) return cc.audioEngine.AudioState.ERROR;
    return cc.audioEngine.getState( this.m_caches.get( path ).audio );
  }

  /**
   * 输出信息
   */
  dump() {
    let data = [ piggy.i18n.t( piggy.i18nK.audio_volume ) + this.m_volume ];
    this.m_caches.forEach( ( sound, path ) => {
      let state = this.getState( path );
      let context = { path: path, type: sound.type, state: state };
      data.push( piggy.strings.render( piggy.i18n.t( piggy.i18nK.audio_information ), context ) );
    } );
    piggy.logger.info( piggy.i18n.t( piggy.i18nK.audio_all_information ), ...data );
  }
}

export { Sound as sound };

