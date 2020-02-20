const Promise = require("bluebird"),
  path = require("path"),
  fs = require("fs");
Promise.promisifyAll(fs);

class generate_asset_paths {
  constructor() {
    this.paths = {};
    this.rootPath = "";
    this.savePath = "";
  }

  async walk_dir(dir) {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      let filePath = path.join(dir, files[i]);
      let stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        this.walk_dir(filePath);
      } else if (
        stat.isFile() &&
        !filePath.endsWith(".meta") &&
        files[i] !== ".DS_Store"
      ) {
        let paths = filePath
          .split(this.rootPath + "/")
          .pop()
          .split(".")[0]
          .split("/");
        let key = paths.join("_");
        this.paths[key] = paths.join("/");
      }
    }
  }

  run() {
    fs.readFileAsync("./config.json", "utf8").then((data, err) => {
      if (err) return console.err(err);
      try {
        let config = JSON.parse(data);
        this.rootPath = config.resources;
        this.savePath = config.assetPath;
        this.walk_dir(this.rootPath);
        this.save();
      } catch (e) {
        console.error(e);
      }
    });
  }

  save() {
    let content = fs
      .readFileSync("./AssetPathTemplate.txt", "utf8")
      .replace("__CONTENT__", JSON.stringify(this.paths, null, 2));
    fs.writeFileSync(this.savePath, content);
    console.log("资源路径已重新生成");
  }
}

module.exports = generate_asset_paths;
