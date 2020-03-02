import { layerBase } from "../Piggy/Core/Component/LayerBase";

const { ccclass } = cc._decorator;

@ccclass
class LoginLayer extends layerBase {
  onLoad() {
    super.onLoad();
  }

  onEnter() {}
  onExit() {}
}

export { LoginLayer as loginLayer };
