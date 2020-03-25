/**
 * @class
 * @file unreadable
 * @description 字符串可读性处理
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */
export class unreadable {
  static disturb_num = 0;
  static offset_num = 766;
  static range_min = 766;
  static range_max = 879;

  /**
   * 随机一个不可读字符
   * @returns {string}
   */
  static disturb() {
    return String.fromCharCode( piggy.maths.randomInt( this.range_min, this.range_max ) );
  }

  /**
   * 随机num个不可读字符串
   * @param {number} num 随机个数
   * @returns {string}
   */
  static disturb_n( num ) {
    return new Array( num )
      .fill( 0, 0, num )
      .map( () => {
        return this.disturb();
      } )
      .join( "" );
  }

  /**
   * 字符偏移转换-执行
   * @param {string} char 字符
   * @param {number} offset 偏移
   * @returns {string}
   */
  static _encode( char, offset ) {
    return String.fromCharCode( char.charCodeAt( 0 ) + offset );
  }

  /**
   * 字符偏移转换-还原
   * @param {string} char 字符
   * @param {number} offset 偏移
   * @returns {string}
   */
  static _decode( char, offset ) {
    return String.fromCharCode( char.charCodeAt( 0 ) - offset );
  }

  /**
   * 执行字符串不可读操作
   * @param {string} str 字符串
   * @param {number} disturb 干扰等级
   * @param {number} offset 偏移值
   * @returns {string}
   */
  static encode(
    str,
    disturb = unreadable.disturb_num,
    offset = unreadable.offset_num
  ) {
    return Array.prototype.map.call( str, char => {
      return this._encode( char, offset ) + this.disturb_n( disturb );
    } ).join( "" );
  }

  /**
   * 还原字符串可读性操作
   * @param {string} str 字符串
   * @param {number} disturb 干扰等级
   * @param {number} offset 偏移值
   * @returns {string}
   */
  static decode(
    str,
    disturb = unreadable.disturb_num,
    offset = unreadable.offset_num
  ) {
    return Array.prototype.map.call( str, ( char, index ) => {
      let out = index % ( disturb + 1 ) === 0;
      return out ? this._decode( char, offset ) : "";
    } ).join( "" );
  }
}
