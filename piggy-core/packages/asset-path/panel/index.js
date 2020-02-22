// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>asset-path</h2>
    <hr />
    <ui-input id="input" placeholder="请输入resources路径"></ui-input>
    <hr />
    <ui-button id="btn">保存</ui-button>
  `,

  // element and variable binding
  $: {
    btn: "#btn",
    input: "#input"
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {},

  // register your ipc messages here
  messages: {}
});
