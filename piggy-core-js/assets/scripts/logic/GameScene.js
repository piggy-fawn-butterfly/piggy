cc.Class({
  extends: require("../piggy/components/app"),

  properties: {},

  onLoad() {
    this._super();

    piggy.events.on(piggy.constants.EVENT_NAME.ON_APP_SHOW, this.onEnter, this);
    piggy.events.on(piggy.constants.EVENT_NAME.ON_APP_HIDE, this.onExit, this);
  },

  onEnter() {
    piggy.logger.info("游戏进入前台");
  },

  onExit() {
    piggy.logger.info("游戏进入后台");
  }
});
