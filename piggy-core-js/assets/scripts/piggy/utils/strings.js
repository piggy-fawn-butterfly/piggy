import { piggy } from "../piggy";

export const strings = {
  /**
   * 模板字符串插值实现
   * @param {string} template 模板字符串
   * @param {object} context 字符串插值
   */
  render( template, context ) {
    return template.replace(
      /\{\{(.*?)\}\}/g,
      ( match, key ) => context[ key.trim() ]
    );
  },

  /**
   * 字符串高位补零
   * @param {string} str 原字符串
   * @param {number} len 设定默认字符串长度，长度不够时进行高位补零
   * @returns {string} 高位补零后的字符串
   */
  prefixZero( str, len = 1 ) {
    let n = String( str ).length;
    let t = Math.max( 0, len - n );
    t > 0 && ( str = "0".repeat( t ) + str );
    return String( str );
  },

  /**
   * 获得字符串的CharCodes
   * @param {string} str
   * @param {number} len
   * @returns {string}
   */
  getCharCodes( str, len = str.length - 1 ) {
    return str
      .split( "" )
      .slice( 0, len )
      .map( ( v ) => {
        return v.charCodeAt( 0 );
      } )
      .join( "" );
  },

  /**
   * 检测字符串是否json字符串
   * @param {string} raw 字符串
   * @returns {boolean}
   */
  isJsonString( raw ) {
    try {
      let obj = JSON.parse( raw );
      if ( !!obj && typeof obj === "object" ) return true;
    } catch ( e ) {
      console.error( e );
    }
    return false;
  },

  /**
   * 空字符串
   * @param {string} input
   * @returns {boolean}
   */
  isEmpty( input ) {
    return input == null || input == "";
  },

  /**
   * 非空字符串
   * @param {string} input
   * @returns {boolean}
   */
  isNotEmpty( input ) {
    return !this.isEmpty( input );
  },

  /**
   * 空白字符串
   * @param {string} input
   * @returns {boolean}
   */
  isBlank( input ) {
    return input == null || /^\s*$/.test( input );
  },

  /**
   * 非空白字符串
   * @param {string} input
   * @returns {boolean}
   */
  isNotBlank( input ) {
    return !this.isBlank( input );
  },

  /**
   * 删除两边空格
   * @param {string} input
   * @returns {string}
   */
  trim( input ) {
    return input.replace( /^\s+|\s+$/, "" );
  },

  /**
   * 删除两边空格
   * @param {string} input
   */
  trimToEmpty( input ) {
    return input == null ? "" : this.trim( input );
  },

  /**
   * 是否包含指定字符串
   * @param {string} input
   * @param {string} searchSeq
   * @returns {boolean}
   */
  contains( input, searchSeq ) {
    return input.indexOf( searchSeq ) >= 0;
  },

  /**
   * 字符串比较相等
   * @param {string} input1
   * @param {string} input2
   * @returns {boolean}
   */
  equals( input1, input2 ) {
    return input1 == input2;
  },

  /**
   * 字符串比较相等，忽略大小写
   * @param {string} input1
   * @param {string} input2
   * @returns {boolean}
   */
  equalsIgnoreCase( input1, input2 ) {
    return input1.toLocaleLowerCase() == input2.toLocaleLowerCase();
  },

  /**
   * 是否包含空白字符
   * @param {string} input
   * @returns {boolean}
   */
  containsWhitespace( input ) {
    return this.contains( input, " " );
  },

  /**
   * 生成指定个数的字符
   * @param {string} ch
   * @param {number} repeatTimes
   * @returns {string}
   */
  repeat( ch, repeatTimes ) {
    let result = "";
    for ( let i = 0; i < repeatTimes; i++ ) {
      result += ch;
    }
    return result;
  },

  /**
   * 删除空白字符
   * @param {string} input
   * @returns {string}
   */
  deleteWhitespace( input ) {
    return input.replace( /\s+/g, "" );
  },

  /**
   * 添加后缀
   * @param {string} input
   * @param {number} size
   * @param {string} padStr
   * @returns {string}
   */
  rightPad( input, size, padStr ) {
    return input + this.repeat( padStr, size );
  },

  /**
   * 添加前缀
   * @param {string} input
   * @param {number} size
   * @param {string} padStr
   * @returns {string}
   */
  leftPad( input, size, padStr ) {
    return this.repeat( padStr, size ) + input;
  },

  /**
   * 首小写字母转大写
   * @param {string} input
   * @returns {string}
   */
  capitalize( input ) {
    if ( input === null || input.length === 0 ) {
      return input;
    }
    return input.replace( /^[a-z]/, function( matchStr ) {
      return matchStr.toLocaleUpperCase();
    } );
  },

  /**
   * 首大写字母转小写
   * @param {string} input
   * @returns {string}
   */
  unCapitalize( input ) {
    if ( input === null || input.length === 0 ) {
      return input;
    }
    return input.replace( /^[A-Z]/, function( matchStr ) {
      return matchStr.toLocaleLowerCase();
    } );
  },

  /**
   * 大写转小写，小写转大写
   * @param {string} input
   * @returns {string}
   */
  swapCase( input ) {
    return input.replace( /[a-z]/gi, function( matchStr ) {
      if ( matchStr >= "A" && matchStr <= "Z" ) {
        return matchStr.toLocaleLowerCase();
      } else if ( matchStr >= "a" && matchStr <= "z" ) {
        return matchStr.toLocaleUpperCase();
      }
    } );
  },

  /**
   * 统计含有的子字符串的个数
   * @param {string} input
   * @param {string} sub
   * @returns {number}
   */
  countMatches( input, sub ) {
    if ( this.isEmpty( input ) || this.isEmpty( sub ) ) {
      return 0;
    }
    let count = 0;
    let index = 0;
    while ( ( index = input.indexOf( sub, index ) ) != -1 ) {
      index += sub.length;
      count++;
    }
    return count;
  },

  /**
   * 只包含字母
   * @param {string} input
   * @returns {boolean}
   */
  isAlpha( input ) {
    return /^[a-z]+$/i.test( input );
  },

  /**
   * 只包含字母、空格
   * @param {string} input
   * @returns {boolean}
   */
  isAlphaSpace( input ) {
    return /^[a-z\s]*$/i.test( input );
  },

  /**
   * 只包含字母、数字
   * @param {string} input
   * @returns {boolean}
   */
  isAlphanumeric( input ) {
    return /^[a-z0-9]+$/i.test( input );
  },

  /**
   * 只包含字母、数字和空格
   * @param {string} input
   * @returns {boolean}
   */
  isAlphanumericSpace( input ) {
    return /^[a-z0-9\s]*$/i.test( input );
  },

  /**
   * 数字
   * @param {string} input
   * @returns {boolean}
   */
  isNumeric( input ) {
    return /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test( input );
  },

  /**
   * 小数
   * @param {string} input
   * @returns {boolean}
   */
  isDecimal( input ) {
    return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test( input );
  },

  /**
   * 负小数
   * @param {string} input
   * @returns {boolean}
   */
  isNegativeDecimal( input ) {
    return /^\-(?:0|[1-9]\d*)\.\d+$/.test( input );
  },

  /**
   * 正小数
   * @param {string} input
   * @returns {boolean}
   */
  isPositiveDecimal( input ) {
    return /^\+?(?:0|[1-9]\d*)\.\d+$/.test( input );
  },

  /**
   * 整数
   * @param {string} input
   * @returns {boolean}
   */
  isInteger( input ) {
    return /^[-+]?(?:0|[1-9]\d*)$/.test( input );
  },

  /**
   * 正整数
   * @param {string} input
   * @returns {boolean}
   */
  isPositiveInteger( input ) {
    return /^\+?(?:0|[1-9]\d*)$/.test( input );
  },

  /**
   * 负整数
   * @param {string} input
   * @returns {boolean}
   */
  isNegativeInteger( input ) {
    return /^\-(?:0|[1-9]\d*)$/.test( input );
  },

  /**
   * 只包含数字和空格
   * @param {string} input
   * @returns {boolean}
   */
  isNumericSpace( input ) {
    return /^[\d\s]*$/.test( input );
  },

  /**
   * 只包含空字符
   * @param {string} input
   * @returns {boolean}
   */
  isWhitespace( input ) {
    return /^\s*$/.test( input );
  },

  /**
   * 全部小写字母
   * @param {string} input
   * @returns {boolean}
   */
  isAllLowerCase( input ) {
    return /^[a-z]+$/.test( input );
  },

  /**
   * 全部大写字母
   * @param {string} input
   * @returns {boolean}
   */
  isAllUpperCase( input ) {
    return /^[A-Z]+$/.test( input );
  },

  /**
   * 字符串反转
   * @param {string} input
   * @returns {string}
   */
  reverse( input ) {
    if ( this.isBlank( input ) ) {
      input;
    }
    return input
      .split( "" )
      .reverse()
      .join( "" );
  },

  /**
   * 删掉特殊字符(英文状态下)
   * @param {string} input
   * @returns {string}
   */
  removeSpecialCharacter( input ) {
    return input.replace( /[!-/:-@\[-`{-~]/g, "" );
  },

  /**
   * 只包含特殊字符、数字和字母（不包括空格，若想包括空格，改为[ -~]）
   * @param {string} input
   * @returns {boolean}
   */
  isSpecialCharacterAlphanumeric( input ) {
    return /^[!-~]+$/.test( input );
  },

  /**
   * 消息格式化
   * @param {string} message
   * @param {any[]} arr
   * @returns {string}
   */
  format( message, arr ) {
    return message.replace( /{(\d+)}/g, function( _, group ) {
      return arr[ group ];
    } );
  },

  /**
   * 把连续出现多次的字母字符串进行压缩。如输入:aaabbbbcccccd  输出:3a4b5cd
   * @param {string} input
   * @param {boolean} ignoreCase
   * @returns {string}
   */
  compressRepeatedStr( input, ignoreCase ) {
    let pattern = new RegExp( "([a-z])\\1+", ignoreCase ? "ig" : "g" );
    return input.replace( pattern, function( matchStr, group1 ) {
      return matchStr.length + group1;
    } );
  },

  /**
   * 中文校验
   * @param {string} input
   * @returns {boolean}
   */
  isChinese( input ) {
    return /^[\u4E00-\u9FA5]+$/.test( input );
  },

  /**
   * 去掉中文字符
   * @param {string} input
   * @returns {string}
   */
  removeChinese( input ) {
    return input.replace( /[\u4E00-\u9FA5]+/gm, "" );
  },

  /**
   * 转义元字符
   * @param {string} input
   * @returns {string}
   */
  escapeMetaCharacter( input ) {
    let metaCharacter = "^$()*+.[]|\\-?{}";
    if ( metaCharacter.indexOf( input ) >= 0 ) {
      input = "\\" + input;
    }
    return input;
  },

  /**
   * 转义字符串中的元字符
   * @param {string} input
   * @returns {string}
   */
  escapeMetaCharacterOfStr( input ) {
    return input.replace( /[-$^()*+.\[\]|\\?{}]/gm, "\\$&" );
  },

  /**
   * 中文转为unicode编码
   * @param {string} input
   * @returns {string}
   */
  chineseToUnicode( input ) {
    return input.replace( /[\u4E00-\u9FA5]/g, function( matchStr ) {
      return "\\u" + matchStr.charCodeAt( 0 ).toString( 16 );
    } );
  },

  /**
   * 自定义嵌套符号rule={'(':')','[':']','{':'}','<':'>'};
   * @param {object} rule
   * @param {string} str
   * @returns {boolean}
   */
  isNest( rule, str ) {
    if ( !( rule && str ) ) {
      return false;
    }
    let keys = [];
    let values = [];
    for ( let key in rule ) {
      if ( rule.hasOwnProperty( key ) ) {
        keys.push( key );
        values.push( rule[ key ] );
      }
    }
    let chs = str.split( "" );
    let len = chs.length;
    let stack = [];
    for ( let i = 0; i < len; i++ ) {
      if ( keys.indexOf( chs[ i ] ) > -1 ) {
        stack.push( rule[ chs[ i ] ] );
      } else {
        if ( chs[ i ] === stack[ stack.length - 1 ] ) {
          stack.pop();
        } else if ( values.indexOf( chs[ i ] ) > -1 ) {
          return false;
        }
      }
    }
    return stack.length === 0;
  },

  /**
   * 是否手机号码
   * @param {string} input
   * @returns {boolean}
   */
  isPhoneNumber( input ) {
    return piggy.constants.PHONE_PATTERNS.PHONE_SIMPLE.test( input );
  },

  /**
   * 是否手机号码
   * @param {string} input
   * @returns {boolean}
   */
  isPhoneMobile( input ) {
    return piggy.constants.PHONE_PATTERNS.PHONE_MOBILE.test( input );
  },

  /**
   * 是否座机号码
   * @param {string} input
   * @returns {boolean}
   */
  isPhoneCall( input ) {
    return piggy.constants.PHONE_PATTERNS.PHONE_CALL.test( input );
  },

  /**
   * 是否移动号码
   * @param {string} input
   * @returns {boolean}
   */
  isChinaTelecom( input ) {
    return piggy.constants.PHONE_PATTERNS.CHINA_TELECOM.test( input );
  },

  /**
   * 是否移动号码
   * @param {string} input
   * @returns {boolean}
   */
  isChinaUnicom( input ) {
    return piggy.constants.PHONE_PATTERNS.CHINA_UNICOM.test( input );
  },

  /**
   * 是否移动号码
   * @param {string} input
   * @returns {boolean}
   */
  isChinaMobile( input ) {
    return piggy.constants.PHONE_PATTERNS.CHINA_MOBILE.test( input );
  },

  /**
   * 邮箱格式校验
   * @param {string} input
   * @returns {boolean}
   */
  isEmail( input ) {
    return piggy.constants.PHONE_PATTERNS.EMAIL_ADDRESS.test( input );
  },

  /**
   * 18位身份证简单校验
   * @param {string} idCard
   * @returns {boolean}
   */
  isSimpleIdCard18( idCard ) {
    return piggy.constants.PHONE_PATTERNS.ID_CARD_18_SIMPLE.test( idCard );
  },

  /**
   * 18位身份证校验码校验
   * @param {string} idCard
   * @returns {boolean}
   */
  checkIdCardCode( idCard ) {
    let multiplier = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    let idData = idCard.split( "" );
    let len = 17;
    let sum = 0;
    for ( let i = 0; i < len; i++ ) {
      sum += parseInt( idData[ i ] ) * multiplier[ i ];
    }
    let remainder = sum % 11;
    let checkCodeArr = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];
    let checkCode = checkCodeArr[ remainder ];
    return checkCode === idCard[ 17 ];
  },

  /**
   * 18位身份证严格校验
   * @param {string} idCard
   * @returns {boolean}
   */
  isIdCard18( idCard ) {
    //先校验格式
    if ( this.isSimpleIdCard18( idCard ) ) {
      //校验日期时间是否合法
      let dateStr = idCard.substr( 6, 8 );
      let dateStrNew = dateStr.replace( /(\d{4})(\d{2})(\d{2})/, "$1/$2/$3" );
      let dateObj = new Date( dateStrNew );
      let month = dateObj.getMonth() + 1;
      if ( parseInt( dateStr.substr( 4, 2 ) ) === month ) {
        return this.checkIdCardCode( idCard );
      }
    }
    return false;
  }
};
