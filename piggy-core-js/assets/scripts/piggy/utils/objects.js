export const objects = {
  /**
   * 简单拷贝
   * @param {{resource: {xing_fu: {val: number, min: number, max: number}, kuang_chan: {val: number, min: number, max: number}, xing_yang: {val: number, min: number, max: number}, liang_shi: {val: number, min: number, max: number}, ren_kou: {val: number, min: number, max: number}, mu_cai: {val: number, min: number, max: number}, jin_bi: {val: number, min: number, max: number}}, sound: {volume: {val: number, min: number, max: number}, music: {val: boolean}, effect: {val: boolean}}, time: {game: {val: number, min: number, max: number}}, map: {building: {val: {"1515": {ct: number, no: number, lt: number, tm: string, lv: number, id: number}}}}}|{resource: {xing_fu: {val: number, min: number, max: number}, kuang_chan: {val: number, min: number, max: number}, xing_yang: {val: number, min: number, max: number}, liang_shi: {val: number, min: number, max: number}, ren_kou: {val: number, min: number, max: number}, mu_cai: {val: number, min: number, max: number}, jin_bi: {val: number, min: number, max: number}}, sound: {volume: {val: number, min: number, max: number}, music: {val: boolean}, effect: {val: boolean}}, time: {game: {val: number, min: number, max: number}}, map: {building: {val: {"1515": {ct: number, no: number, lt: number, tm: string, lv: number, id: number}}}}}} obj 对象或其他数据
   * @returns {any}
   */
  clone( obj ) {
    return JSON.parse( JSON.stringify( obj ) );
  }
};
