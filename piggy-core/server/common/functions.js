const fs = require("fs");
const path = require("path");
const UUID = require("uuid");

/**
 * 获得uuid
 */
module.exports.uuidV1 = function() {
  return UUID.v1();
};

/**
 * JSON 转 Buffer
 * @param {string} type
 * @param {object} msg
 */
module.exports.toData = function(type, msg) {
  return Buffer.from(
    JSON.stringify({
      type: type,
      msg: msg
    }),
    "utf8"
  );
};

/**
 * Buffer 转 JSON
 * @param {Buffer} message
 */
module.exports.fromMsg = function(message) {
  return JSON.parse(message.toString());
};

/**
 * 获得连接数量
 * @param {object} clients
 */
module.exports.connections = function(clients) {
  return Object.keys(clients).length;
};

/**
 * 读取文件内容
 * @param {string} filename
 */
module.exports.cat = function(filename) {
  return fs.readFileSync(path.resolve(__dirname, "../" + filename), "utf8");
};
