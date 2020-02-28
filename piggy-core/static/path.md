# Static Files Path

## 修改的文件

### 自定义的文件

- **new-script.js**
  - 改动：自定义创建 js 文件
  - 路径：`path/to/cocos/static/template/new-script.js`
- **new-script.ts**
  - 改动：自定义创建 ts 文件
  - 路径：`path/to/cocos/static/template/new-script.ts`

### 可选优化的文件

- **boot.js**

  - 改动：只保留屏幕宽高比不相同的设备
  - 路径：`path/to/cocos/static/preview-templates/boot.js`

### 必须替换的文件

- **CCNode.js**
  - 改动：增加了新的事件类型，替换后需要重新编译引擎
    - `TOUCH_OUT` 在节点外部触摸开始时触发
    - `TOUCH_MOVE_IN` 从节点外部移入到内部时触发
    - `TOUCH_MOVE_OUT` 从节点内部移出到外部时触发
  - 路径：`path/to/cocos/engine/cocos2d/core/CCNode.js`

## 编译引擎

```shell
cd path/to/cocos/engine
npm install -g gulp
npm install
gulp build --max-old-space-size=8192
```
