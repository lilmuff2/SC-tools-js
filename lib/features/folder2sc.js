//Importing modules
const { Image } = require("image-js");
const PNG = require("fast-png");
const prompt = require("prompt-sync")();
const {
  SupercellSWF,
  Texture,
  Shape,
  ShapeDrawCommand,
  COMPRESSION,
  MovieClip,
  MovieClipFrame,
  TransformBank,
  Matrix,
  Color,
} = require("supercell-swf");
const { readFileSync } = require("fs");
const { hrtime } = require("process");
const { print, colours, color } = require("../console");
const locale_1 = require("../locale");
const fs = require("fs");
const constants = require("../constants");
const config_1 = require("../config");

//Converting Flder 2 sc with icons
function Folder2IconsSc() {
  let maxID = 0;
  let swf = new SupercellSWF();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  let FolderName = prompt(
    color(
      locale_1.locale.InputFoldderName,
      false,
      colours.fg.orange,
      colours.bg.black
    )
  );
  if (FolderName == "") {
    return;
  }
  //chacking if folder exist
  let ids = [];

  function addID(id) {
    ids.push(id);
  }

  function ID(id) {
    return ids.indexOf(id) + maxID;
  }

  if (fs.existsSync(constants.FOLDERS + FolderName)) {
    let merge = prompt(
      color(locale_1.locale.Merge, false, colours.fg.orange, colours.bg.black)
    );
    if (merge != "") {
      let name = prompt(
        color(
          locale_1.locale.InputFileName,
          false,
          colours.fg.orange,
          colours.bg.black
        )
      );
      swf.load(constants.SC + name + `.sc`);
      maxID = Math.max(...Object.keys(swf.resources)) + 1;
    }
    let startTime = hrtime();
    let dir = constants.FOLDERS + FolderName + `/`;
    let Folder = fs.readdirSync(constants.FOLDERS + FolderName);
    addID("Рамка_Tex");
    addID("Рамка");
    //Creating a new swf class
    swf.compression = COMPRESSION.FAST_LZMA;
    //Transform Bank
    let transformBank = new TransformBank();
    swf.banks.push(transformBank);
    //Bitmap for this resource
    let shape_bitmap = new ShapeDrawCommand();
    //With a movie clip, we can animate different objects that also have IDs
    let movieClip = new MovieClip();
    let frame = new MovieClipFrame();

    let teximage = new Texture();
    let shape = new Shape();
    let image = new Image(5, 5);
    teximage.image = new Image(image.width, image.height, image.data, {
      components: image.channels % 2 == 0 ? image.channels - 1 : image.channels,
      alpha: image.channels % 2 == 0 ? true : false,
      bitDepth: image.depth,
    });
    //Adding texture to sc
    if (teximage.image.channels >= 4) {
      teximage.pixelFormat = "GL_RGBA4";
    } else {
      teximage.pixelFormat = "GL_RGB565";
    }
    swf.textures.push(teximage);
    //Bitmap
    //Bitmap texture image index
    shape_bitmap.textureIndex = swf.textures.indexOf(teximage);

    //Points on texture
    shape_bitmap.uvCoords = [
      [0, 0],
      [teximage.image.width, 0],
      [teximage.image.width, teximage.image.height],
      [0, teximage.image.height],
    ];
    //Creating a coordinate for a view in the game
    shape_bitmap.xyCoords = [
      [-4, -4],
      [4, -4],
      [4, 4],
      [-4, 4],
    ];
    //Adding a bitmap to shape
    shape.bitmaps.push(shape_bitmap);
    //Adding a resource to swf
    var shapeId = ID("Рамка_Tex");
    swf.resources[shapeId] = shape;
    //Moveclip
    movieClip.framerate = 60;
    movieClip.bankIndex = swf.banks.indexOf(transformBank);
    //add a bind to use in frames
    movieClip.binds.push({
      id: shapeId,
      blend: 0,
      name: "Рамка",
    });

    frame.elements.push({
      bind: 0,
    });

    movieClip.frames.push(frame);
    movieClip.nine_slice = [-2, -2, 4, 4];
    var movieclipId = ID("Рамка");
    //Create an ID and add it to resources
    swf.resources[movieclipId] = movieClip;
    let Matrix1 = new Matrix({
      a: 10.625,
      d: 10.625,
    });
    let Matrix2 = new Matrix({
      a: 0.3212890625,
      d: 0.3212890625,
    });
    let Matrix3 = new Matrix({
      a: 12.5,
      d: 12.5,
    });
    transformBank.matrices.push(Matrix1);
    transformBank.matrices.push(Matrix2);
    transformBank.matrices.push(Matrix3);
    for (let file of Folder) {
      if (file.endsWith(".png")) {
        //Parts of sc
        //Creating a new teximage
        let teximage = new Texture();
        //Shapes
        let shape = new Shape();
        let shapeSmall = new Shape();
        //Bitmap for this resource
        let shape_bitmap = new ShapeDrawCommand();
        let shape_bitmapSmall = new ShapeDrawCommand();
        //With a movie clip, we can animate different objects that also have IDs
        let movieClip = new MovieClip();
        let frame = new MovieClipFrame();
        //Edit parts of sc

        //Texture
        //png data
        let image = PNG.decode(readFileSync(dir + file));
        teximage.image = new Image(image.width, image.height, image.data, {
          components:
            image.channels % 2 == 0 ? image.channels - 1 : image.channels,
          alpha: image.channels % 2 == 0 ? true : false,
          bitDepth: image.depth,
        });
        //Adding texture to sc
        if (teximage.image.channels >= 4) {
          teximage.pixelFormat = "GL_RGBA4";
        } else {
          teximage.pixelFormat = "GL_RGB565";
        }
        swf.textures.push(teximage);

        let big = false;
        let small = false;
        if (file.includes("_big")) {
          big = true;
          file = file.replace("_big", "");
        }
        if (file.includes("_small")) {
          small = true;
          file = file.replace("_small", "");
        }
        // ading ids
        addID("shape_big" + file);
        addID("shape_smal" + file);
        addID("mc_big" + file);
        addID("mc_small" + file);
        addID("mc_pfp" + file);
        //Bitmap
        //Bitmap texture image index
        shape_bitmap.textureIndex = swf.textures.indexOf(teximage);
        shape_bitmapSmall.textureIndex = swf.textures.indexOf(teximage);

        //Points on texture
        shape_bitmap.uvCoords = [
          [0, 0],
          [teximage.image.width, 0],
          [teximage.image.width, teximage.image.height],
          [0, teximage.image.height],
        ];
        //Creating a coordinate for a view in the game
        if (big) {
          shape_bitmap.xyCoords = [
            [-200, -134],
            [170, -134],
            [170, 133],
            [-200, 133],
          ];
        } else {
          shape_bitmap.xyCoords = [
            [-200, -134],
            [137, -134],
            [137, 133],
            [-200, 133],
          ];
        }
        //Adding a bitmap to shape
        shape.bitmaps.push(shape_bitmap);
        //Adding a resource to swf
        var shapeId = ID("shape_big" + file);
        swf.resources[shapeId] = shape;

        //Bitmap Small
        if (small) {
          shape_bitmapSmall.uvCoords = [
            [0, 0],
            [Math.round(teximage.image.width * 0.75), 0],
            [Math.round(teximage.image.width * 0.75), teximage.image.height],
            [0, teximage.image.height],
          ];
        } else {
          shape_bitmapSmall.uvCoords = [
            [0, 0],
            [teximage.image.width, 0],
            [teximage.image.width, teximage.image.height],
            [0, teximage.image.height],
          ];
        }
        shape_bitmapSmall.xyCoords = [
          [-134.0, -134],
          [133, -134],
          [133, 133],
          [-134.0, 133],
        ];
        //Adding a bitmap to shape
        shapeSmall.bitmaps.push(shape_bitmapSmall);
        //Adding a resource to swf
        var shapeSmalId = ID("shape_smal" + file);
        swf.resources[shapeSmalId] = shapeSmall;

        //Moveclip
        movieClip.framerate = 60;
        movieClip.bankIndex = swf.banks.indexOf(transformBank);

        //add a bind to use in frames
        movieClip.binds.push({
          id: shapeId,
          blend: 0,
          name: "icon_big",
        });

        frame.elements.push({
          bind: 0,
        });

        movieClip.frames.push(frame);

        var movieclipId = ID("mc_big" + file);
        //Create an ID and add it to resources
        swf.resources[movieclipId] = movieClip;
        swf.exports.removeExport(`hero_icon_${file.replace(".png", "")}_big`);
        swf.exports.addExport(
          movieclipId,
          `hero_icon_${file.replace(".png", "")}_big`
        );

        //movieclip Small
        movieClip = new MovieClip();
        movieClip.framerate = 60;
        movieClip.bankIndex = swf.banks.indexOf(transformBank);

        //add a bind to use in frames
        movieClip.binds.push({
          id: shapeSmalId,
          blend: 0,
          name: "icon_small",
        });
        frame = new MovieClipFrame();

        frame.elements.push({
          bind: 0,
        });

        movieClip.frames.push(frame);

        movieclipId = ID("mc_small" + file);
        //Create an ID and add it to resources
        swf.resources[movieclipId] = movieClip;
        swf.exports.removeExport(`hero_icon_${file.replace(".png", "")}_small`);
        swf.exports.addExport(
          movieclipId,
          `hero_icon_${file.replace(".png", "")}_small`
        );
        //movieclip pfp
        movieClip = new MovieClip();
        movieClip.framerate = 60;
        movieClip.bankIndex = swf.banks.indexOf(transformBank);

        //add a bind to use in frames
        movieClip.binds.push({
          id: ID("Рамка"),
          blend: 0,
          name: "Рамка",
        });
        movieClip.binds.push({
          id: ID("Рамка"),
          blend: 0,
          name: "Рамка",
        });
        movieClip.binds.push({
          id: shapeSmalId,
          blend: 0,
          name: "pfp_icon",
        });
        frame = new MovieClipFrame();

        frame.elements.push({
          bind: 0,
          matrix: transformBank.matrices.indexOf(Matrix1),
        });
        let color = new Color({
          R_add: getRandomInt(255),
          G_add: getRandomInt(255),
          B_add: getRandomInt(255),
        });
        transformBank.colors.push(color);
        frame.elements.push({
          bind: 1,
          matrix: transformBank.matrices.indexOf(Matrix2),
          color: transformBank.colors.indexOf(color),
        });
        frame.elements.push({
          bind: 2,
          matrix: transformBank.matrices.indexOf(Matrix3),
        });

        movieClip.frames.push(frame);
        movieclipId = ID("mc_pfp" + file);
        //Create an ID and add it to resources
        swf.resources[movieclipId] = movieClip;
        swf.exports.removeExport(`player_icon_${file.replace(".png", "")}`);
        swf.exports.addExport(
          movieclipId,
          `player_icon_${file.replace(".png", "")}`
        );
      }
    }
    swf.hasExternalTexture = true;
    swf.useUncommonTexture = false;
    swf.compression = config_1.config.defaultCompression;
    swf.save(constants.SC + FolderName + `.sc`);
    print(
      locale_1.locale.format(locale_1.locale.done, hrtime(startTime)),
      false,
      colours.fg.black,
      colours.bg.green
    );
  } else {
    return prompt(
      locale_1.locale.nofile.replace("%s", constants.FOLDERS + FolderName)
    );
  }
  prompt(
    color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black)
  );
}
//Folder2IconsSc()
module.exports = {
  Folder2IconsSc,
};
