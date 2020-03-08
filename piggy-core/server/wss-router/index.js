const router = require("koa-router");
const { toData, fromMsg, connections, uuidV1 } = require("../common/functions");

const wss_router = new router();
wss_router.all("/wss", ctx => {
  const uuid = uuidV1();
  ctx.app.clients[uuid] = ctx.websocket;
  ctx.websocket.uuid = uuid;
  console.log(`websocket connected ${uuid}`, connections(ctx.app.clients));

  ctx.websocket.on("close", () => {
    let _uuid = ctx.websocket.uuid;
    delete ctx.app.clients[_uuid];
    console.log(`websocket close ${_uuid}`, connections(ctx.app.clients));
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
