const generate_asset_paths = require("./generate_asset_paths");

class PiggyTools {
  constructor() {
    this.command = process.argv[2];
  }

  run() {
    switch (this.command) {
      case "assets":
        new generate_asset_paths().run();
        break;
    }
  }
}

new PiggyTools().run();
