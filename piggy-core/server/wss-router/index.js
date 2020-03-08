const UUID = require("uuid");
const router = require("koa-router");
const wss_router = new router();

function toData(type, msg) {
  return Buffer.from(
    JSON.stringify({
      type: type,
      msg: msg
    }),
    "utf8"
  );
}

function fromMsg(message) {
  return JSON.parse(message.toString());
}

function getClientSize(clients) {
  return Object.keys(clients).length;
}

wss_router.all("/wss", ctx => {
  const uuid = UUID.v1();
  ctx.app.clients[uuid] = ctx.websocket;
  ctx.websocket.uuid = uuid;
  console.log(`websocket connected ${uuid}`, getClientSize(ctx.app.clients));

  ctx.websocket.on("close", () => {
    let _uuid = ctx.websocket.uuid;
    delete ctx.app.clients[_uuid];
    console.log(`websocket close ${_uuid}`, getClientSize(ctx.app.clients));
  });

  ctx.websocket.on("error", err => {
    console.error(`error occurs in ${ctx.websocket.uuid}: `, err);
    ctx.websocket.send(toData("socket_error_occurs", { err: "error occurs" }));
  });

  ctx.websocket.on("message", message => {
    console.info(`receive from ${ctx.websocket.uuid}: `, fromMsg(message));
    ctx.websocket.send(toData("socket_keep_alive", { alive: Date.now() }));
  });
});

module.exports = wss_router;
