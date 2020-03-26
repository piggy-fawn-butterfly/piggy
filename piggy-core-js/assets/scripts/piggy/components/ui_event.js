/**
 * @class
 * @description UI事件构成类
 */
export default ui_event = cc.Class({
  name: "ui_event",
  properties: {
    node: { type: cc.Node, default: null },
    type: {
      type: piggy.constants.UI_EVENT_TYPE_NAME,
      default: piggy.constants.UI_EVENT_TYPE_NAME.Touchable
    }
  }
});
