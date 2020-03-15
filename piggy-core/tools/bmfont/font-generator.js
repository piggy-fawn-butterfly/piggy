const generateBMFont = require("msdf-bmfont-xml");
const fs = require("fs");

generateBMFont(
  "Roboto Mono Light for Powerline.ttf",
  {
    fileType: "sdf",
    charset: "ABC.ez_as-123!",
    fontSize: 32
  },
  (error, textures, font) => {
    if (error) throw error;
    textures.forEach((texture, index) => {
      fs.writeFile(texture.filename + ".png", texture.texture, err => {
        console.log("==>", texture.filename, texture.texture);
        if (err) throw err;
      });
    });
    fs.writeFile(font.filename, font.data, err => {
      if (err) throw err;
    });
  }
);
