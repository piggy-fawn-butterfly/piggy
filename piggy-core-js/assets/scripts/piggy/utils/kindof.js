/**
 * @file KindOf
 * @description 数值类型判断
 * @author DoooReyn <jl88744653@gmail.com>
 * @license MIT
 */

/**
 * @param {any} obj
 * @returns {boolean}
 */
function _isBuffer( obj ) {
  return (
    !!obj.constructor &&
    typeof obj.constructor.isBuffer === "function" &&
    obj.constructor.isBuffer( obj )
  );
}

/**
 * 是否Buffer
 * @param {any} obj
 * @returns {boolean}
 */
function isBuffer( obj ) {
  return obj != null && ( _isBuffer( obj ) || !!obj._isBuffer );
}

/**
 * Get the native `typeof` a value.
 * @param  {any} val
 * @returns {string} Native javascript type
 */
export function kindof( val ) {
  let toString = Object.prototype.toString;
  // primitives
  if ( typeof val === "undefined" ) {
    return "undefined";
  }
  if ( val === null ) {
    return "null";
  }
  if ( val === true || val === false || val instanceof Boolean ) {
    return "boolean";
  }
  if ( typeof val === "string" || val instanceof String ) {
    return "string";
  }
  if ( typeof val === "number" || val instanceof Number ) {
    return "number";
  }

  // functions
  if ( typeof val === "function" || val instanceof Function ) {
    return "function";
  }

  // array
  if ( typeof Array.isArray !== "undefined" && Array.isArray( val ) ) {
    return "array";
  }

  // check for instances of RegExp and Date before calling `toString`
  if ( val instanceof RegExp ) {
    return "regexp";
  }
  if ( val instanceof Date ) {
    return "date";
  }

  // other objects
  let type = toString.call( val );

  if ( type === "[object RegExp]" ) {
    return "regexp";
  }
  if ( type === "[object Date]" ) {
    return "date";
  }
  if ( type === "[object Arguments]" ) {
    return "arguments";
  }
  if ( type === "[object Error]" ) {
    return "error";
  }

  // buffer
  if ( isBuffer( val ) ) {
    return "buffer";
  }

  // es6: Map, WeakMap, Set, WeakSet
  if ( type === "[object Set]" ) {
    return "set";
  }
  if ( type === "[object WeakSet]" ) {
    return "weakset";
  }
  if ( type === "[object Map]" ) {
    return "map";
  }
  if ( type === "[object WeakMap]" ) {
    return "weakmap";
  }
  if ( type === "[object Symbol]" ) {
    return "symbol";
  }

  // typed arrays
  if ( type === "[object Int8Array]" ) {
    return "int8array";
  }
  if ( type === "[object Uint8Array]" ) {
    return "uint8array";
  }
  if ( type === "[object Uint8ClampedArray]" ) {
    return "uint8clampedarray";
  }
  if ( type === "[object Int16Array]" ) {
    return "int16array";
  }
  if ( type === "[object Uint16Array]" ) {
    return "uint16array";
  }
  if ( type === "[object Int32Array]" ) {
    return "int32array";
  }
  if ( type === "[object Uint32Array]" ) {
    return "uint32array";
  }
  if ( type === "[object Float32Array]" ) {
    return "float32array";
  }
  if ( type === "[object Float64Array]" ) {
    return "float64array";
  }

  // must be a plain object
  return "object";
}
