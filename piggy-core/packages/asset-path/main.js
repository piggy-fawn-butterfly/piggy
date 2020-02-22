"use strict";

module.exports = {
  load() {
    // execute when package loaded
    this.generate();
  },

  unload() {
    // execute when package unloaded
  },

  generate() {
    var _path = require("path");
    var _file = require("fs");
    var resources = {};
    var root_path = _path.resolve(
      __dirname,
      _path.join(Editor.Project.path, "assets/resources")
    );
    if (!Editor.assetdb.exists("db://assets")) {
      return;
    }

    //遍历目录
    function walk_dir(dir) {
      let files = _file.readdirSync(dir);
      for (let i = 0; i < files.length; i++) {
        let file_path = _path.join(dir, files[i]);
        let stat = _file.statSync(file_path);
        if (stat.isDirectory()) {
          walk_dir(file_path);
        } else if (
          stat.isFile() &&
          !file_path.endsWith(".meta") &&
          files[i] !== ".DS_Store"
        ) {
          let paths = file_path
            .split(root_path + "/")
            .pop()
            .split(".")[0]
            .split("/");
          let key = paths.join("_");
          resources[key] = paths.join("/");
        }
      }
    }

    walk_dir(root_path);

    var content =
      "/**\n" +
      " * @file AssetPath\n" +
      " * @description 资源路径定义，该文件通过工具生成\n" +
      " * @author DoooReyn <jl88744653@gmail.com>\n" +
      " * @license MIT\n" +
      " * @identifier\n" +
      " * ```\n" +
      " *             ╥━━━┳━━━━━━━━━╭━━╮━━━┳━━━╥\n" +
      " *             ╢━D━┣ ╭╮╭━━━━━┫┃▋▋━▅ ┣━R━╢\n" +
      " *             ╢━O━┣ ┃╰┫┈┈┈┈┈┃┃┈┈╰┫ ┣━E━╢\n" +
      " *             ╢━O━┣ ╰━┫┈┈┈┈┈╰╯╰┳━╯ ┣━Y━╢\n" +
      " *             ╢━O━┣ ┊┊┃┏┳┳━━┓┏┳┫┊┊ ┣━N━╢\n" +
      " *             ╨━━━┻━━━┗┛┗┛━━┗┛┗┛━━━┻━━━╨\n" +
      " * ```\n" +
      " */\n" +
      "const AssetPath = " +
      JSON.stringify(resources, null, 2) +
      "\n\nexport {AssetPath as assetPath};\n";
    Editor.assetdb.saveExists(
      "db://assets/Script/Piggy/Const/AssetPath.ts",
      content,
      (err, results) => {}
    );
    // Editor.log("content:", content);
  },

  // register your ipc messages here
  messages: {
    "scene:saved"(event) {
      this.generate();
    }
  }
};
