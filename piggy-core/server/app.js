const fs = require("fs");
const path = require("path");
const koa_app = require("koa");
const koa_websocket = require("koa-websocket");
const wss_router = require("./wss-router");
const { CA, PORT } = require("./config/constants");

/**
 * 读取文件内容
 * @param {string} filename
 */
function cat(filename) {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf8");
}

//创建服务器选项
const server_options = {
  key: cat(CA.KEY),
  cert: cat(CA.CRT),
  passphrase: CA.PASS
};
const piggy_app = koa_websocket(new koa_app(), {}, server_options);
piggy_app.clients = {};
piggy_app.listen(PORT.WSS);
piggy_app.ws.use(wss_router.routes(), wss_router.allowedMethods());

module.exports = piggy_app;
