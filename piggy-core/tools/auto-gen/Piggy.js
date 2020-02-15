const Promise = require("bluebird"),
  path = require("path"),
  fs = require("fs");

Promise.promisifyAll(fs);

class Piggy {
  constructor() {}
}

console.log(process.argv, process.argv.length);
if (process.argv.length <= 2) {
  return console.warn("请提供一个创建项目的路径!");
}

let target_path = process.argv[2];
fs.exists(target_path, exists => {
  if (exists) {
    return console.log("请提供一个空目录");
  }
  target_path = path.resolve(target_path);
  fs.mkdirAsync(target_path, { recursive: true }).then(err => {
    if (err) {
      return console.log(err);
    }
  });
});
