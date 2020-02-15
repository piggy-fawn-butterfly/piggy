/**
 * url参数转obj
 * @param url
 */
export function toObject(url: string) {
  var regex = /(\w+)=([^&#]*)/gim;
  var matchStr = null;
  var obj = {};
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
  var parameters = "";
  var url = "";
  for (var key in obj) {
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
  var obj = {};
  if (url) {
    url = url.replace(/#[^#]*$/, "");
    var index = url.indexOf("?");
    if (index != -1) {
      var queryStr = url.substr(index + 1);
      var marchResult = null;
      var regex = /(\w+)(=([^&#]+)?)?/g;
      while ((marchResult = regex.exec(queryStr)) != null) {
        if (marchResult[1] in obj) {
          var values = obj[marchResult[1]];
          if (values instanceof Array) {
            values.push(
              marchResult[2] ? (marchResult[3] ? marchResult[3] : "") : null
            );
            obj[marchResult[1]] = values;
          } else {
            var arr = [];
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
