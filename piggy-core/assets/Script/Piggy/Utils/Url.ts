/**
 * @file Urls
 * @description URL扩展
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
namespace urls {
  /**
   * url参数转obj
   * @param url
   */
  export function toObject(url: string) {
    let regex = /(\w+)=([^&#]*)/gim;
    let matchStr = null;
    let obj = {};
    while ((matchStr = regex.exec(url)) != null) {
      obj[matchStr[1]] = matchStr[2];
    }
    return obj;
  }

  /**
   * obj转为url参数
   * @param baseUrl
   * @param obj
   */
  export function fromObject(baseUrl: string, obj: object) {
    let parameters = "";
    let url = "";
    for (let key in obj) {
      parameters += key + "=" + obj[key] + "&";
    }
    parameters = parameters.replace(/&$/, "");
    !/\?$/.test(baseUrl) && (baseUrl = baseUrl.replace(/\/?$/, "?"));
    url = baseUrl + parameters;
    return url;
  }

  /**
   * url参数转obj，若一个字段有多个值的话，返回数组
   * @param url
   */
  export function parseQueryString(url: string) {
    let obj = {};
    if (url) {
      url = url.replace(/#[^#]*$/, "");
      let index = url.indexOf("?");
      if (index != -1) {
        let queryStr = url.substr(index + 1);
        let marchResult = null;
        let regex = /(\w+)(=([^&#]+)?)?/g;
        while ((marchResult = regex.exec(queryStr)) != null) {
          if (marchResult[1] in obj) {
            let values = obj[marchResult[1]];
            if (values instanceof Array) {
              values.push(
                marchResult[2] ? (marchResult[3] ? marchResult[3] : "") : null
              );
              obj[marchResult[1]] = values;
            } else {
              let arr = [];
              arr.push(values);
              arr.push(
                marchResult[2] ? (marchResult[3] ? marchResult[3] : "") : null
              );
              obj[marchResult[1]] = arr;
            }
          } else {
            obj[marchResult[1]] = marchResult[2]
              ? marchResult[3]
                ? marchResult[3]
                : ""
              : null;
          }
        }
      }
    }
    return obj;
  }
}

export { urls };
