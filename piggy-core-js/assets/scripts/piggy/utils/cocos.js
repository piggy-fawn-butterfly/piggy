/** @format */

export const cocos = {
  /**
   * 根据路径和参考节点获取节点
   * @param {string} path 节点相对路径
   * @param {cc.Node} referenceNode 参考节点
   * @returns {cc.Node}
   */
  findNode( path, referenceNode ) {
    return cc.find( path, referenceNode );
  },

  /**
   * 根据路径和参考节点获取节点
   * @param {string} path 节点相对路径
   * @param {cc.Node} referenceNode 参考节点
   * @returns {cc.Node[]}
   */
  findNodes( path, referenceNode = null ) {
    let match = [];
    if ( path == null ) return match;
    if ( referenceNode && !referenceNode.isValid ) return match;
    if ( !referenceNode ) {
      let scene = cc.director.getScene();
      if ( !scene ) return match;
      if ( !scene.isValid ) return match;
      referenceNode = scene;
    }
    let startIndex = path[ 0 ] !== "/" ? 0 : 1;
    let nameList = path.split( "/" );
    for ( let n = startIndex; n < nameList.length; n++ ) {
      let name = nameList[ n ];
      let children = referenceNode[ "_children" ];
      for ( let t = 0, len = children.length; t < len; ++t ) {
        let subChild = children[ t ];
        subChild.name === name && match.push( subChild );
      }
    }

    return match;
  },

  /**
   * 根据路径和参考节点和组件类型获取节点下的组件
   * @param {string} path 节点相对路径
   * @param {typeof cc.Component} component 组件类型
   * @param {cc.Node} referenceNode 参考节点
   * @returns {cc.Component}
   */
  findComponent( path, component, referenceNode ) {
    let node = cc.find( path, referenceNode );
    if ( !node ) return null;
    return node.getComponent( component );
  },

  /**
   * 根据路径和参考节点和组件名称获取节点下的组件
   * @param {string} path 节点相对路径
   * @param {string} component 组件名称
   * @param {cc.Node} referenceNode 参考节点
   * @returns {cc.Component}
   */
  findComponentByName( path, component, referenceNode = null ) {
    let node = cc.find( path, referenceNode );
    if ( !node ) return null;
    return node.getComponent( component );
  },

  /**
   * 自动获取目标节点上的组件，如果找不到组件则自动挂载组件到目标节点
   * @param {cc.Node} node 目标节点
   * @param {string} component 目标组件
   * @returns {cc.Component}
   */
  getOrAddComponent( node, component ) {
    return node.getComponent( component ) || node.addComponent( component );
  },

  /**
   * 获得组件类型
   * @param {cc.Component} component 组件
   */
  instanceOfComponent( component ) {
    if ( component && component.isValid ) {
      return component[ "__proto__" ][ "__classname__" ];
    }
    return "undefined";
  },

  /**
   * 获得节点树路径
   * @param {cc.Node} node 目标节点
   * @param {cc.Node} referenceNode 参考节点
   * @param {boolean} outFullPath 是否输出完整路径
   * @returns {string}
   */
  pathOfNode( node, referenceNode, outFullPath = true ) {
    if ( !referenceNode ) referenceNode = cc.find( "Canvas" );
    let walk = ( from, url ) => {
      url.push( from.parent.name );
      from.parent !== referenceNode && walk( from.parent, url );
    };
    let path = [];
    walk( node, path );
    !outFullPath && path.pop();
    path.unshift( node.name );
    return path.reverse().join( "/" );
  },

  /**
   * 是否触发按钮点击事件
   * @param {cc.Event} e 按钮点击事件
   * @param {boolean} sound 是否触发点击音效
   * @returns 是否触发按钮点击事件
   */
  onClickEvent( e ) {
    if ( e ) {
      let target = null;
      if ( e.target ) {
        target = e.target;
        e.stopPropagation();
      } else {
        target = e;
      }

      if ( target && !this.isButtonAvailable( target ) ) {
        return false;
      }
    }
  },

  /**
   * 按钮是否有效
   * @param {cc.Node} node 按钮节点
   */
  isButtonAvailable( node ) {
    let button = node.getComponent( "Button" );
    let available = true;
    button && ( available = button.available() ) && button.click();
    return available;
  },

  /**
   * 获得节点的世界坐标
   * @param {cc.Node} node 目标节点
   * @returns {cc.Vec3} point 世界坐标
   */
  getWorldPosition( node ) {
    return node.parent.convertToWorldSpaceAR( node.position );
  },

  /**
   * 精灵置灰/解除置灰
   * TODO 原方法会报错，需要同步最新的方案
   * @param {cc.Sprite} sprite 精灵
   * @param {boolean} gray 是否置灰
   */
  setGray( sprite, gray = true ) {
    let builtin = gray ? "2d-gray-sprite" : "2d-sprite";
    let material = cc.Material[ "getBuiltinMaterial" ]( builtin );
    material = cc.Material[ "getInstantiatedMaterial" ]( material, sprite );
    sprite.setMaterial( 0, material );
  },

  /**
   * 停止所有动作
   * @param {cc.Node} node 目标节点
   */
  stopNode( node ) {
    node.stopAllActions();
    node.children.forEach( v => {
      this.stopNode( v );
    } );
  },

  /**
   * 暂停所有动作
   * @param {cc.Node} node 目标节点
   */
  pauseNode( node ) {
    node.stopAllActions();
    node.children.forEach( v => {
      this.pauseNode( v );
    } );
  },

  /**
   * 恢复所有动作
   * @param {cc.Node} node 目标节点
   */
  resumeNode( node ) {
    node.stopAllActions();
    node.children.forEach( v => {
      this.resumeNode( v );
    } );
  },

  /**
   * 获得真实窗口尺寸
   * @returns {cc.Size}
   */
  getCanvasRealSize() {
    let fs = cc.view.getFrameSize();
    let sc = cc.view.getDevicePixelRatio();
    let scx = cc.view.getScaleX();
    let scy = cc.view.getScaleY();
    let width = Math.ceil( ( fs.width / scx ) * sc );
    let height = Math.ceil( ( fs.height / scy ) * sc );
    return cc.size( width, height );
  },

  /**
   * 设置贴图是否抗锯齿
   * @param {cc.Texture2D} tex 贴图
   * @param {boolean} enabled 是否开启抗锯齿
   * @since 2.3.0
   */
  enableAntiAtlas( tex, enabled ) {
    const { LINEAR, NEAREST } = cc.Texture2D.Filter;
    let filter = enabled ? LINEAR : NEAREST;
    tex && tex.setFilters( filter, filter );
  }
};
