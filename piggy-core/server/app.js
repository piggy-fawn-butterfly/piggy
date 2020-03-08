const koa_app = require("koa");
const koa_websocket = require("koa-websocket");
const wss_router = require("./wss-router");
const { cat } = require("./common/functions");
const { CA, PORT } = require("./config/constants");

//HTTPS服务器选项
const server_options = {
  key: cat(CA.KEY),
  cert: cat(CA.CRT),
  passphrase: CA.PASS
};

//使用WebSocket代理
const server = koa_websocket(new koa_app(), {}, server_options);
server.listen(PORT.WSS);

//记录所有连接的客户端
server.clients = {};

//路由分发处理
server.ws.use(wss_router.routes(), wss_router.allowedMethods());

module.exports = server;
