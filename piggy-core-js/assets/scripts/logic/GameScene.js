import { piggy } from "../piggy/piggy";

cc.Class( {
  extends: cc.Component,

  editor: {
    disallowMultiple: true,
  },

  properties: {

  },

  onLoad() {
    // console.log( JSON.stringify( piggy, null, 2 ) );
    console.log( piggy );
  }
} );
