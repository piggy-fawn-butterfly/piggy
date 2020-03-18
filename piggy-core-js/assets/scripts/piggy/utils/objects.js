export const objects = {
  /**
     * 简单拷贝
     * @param {any} obj 对象或其他数据
     * @returns {any}
     */
  clone( obj ) {
    return JSON.parse( JSON.stringify( obj ) );
  }
};
