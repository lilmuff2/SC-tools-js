const { existsSync, writeFileSync } = require("fs");
const {
  SupercellSWF,
  MovieClip,
  Shape,
  ScBuffer,
  COMPRESSION,
  TransformBank,
  TextField,
  MovieClipModifier,
} = require("supercell-swf");
const { hrtime } = require("process");
const { print, colours, color } = require("../console");
const locale_1 = require("../locale");
const prompt = require("prompt-sync")();
const constants = require("../constants");
const { Console } = require("console");
const config_1 = require("../config");

function mergeFiles() {
  const file = prompt(
    color(
      locale_1.locale.InputFileName,
      false,
      colours.fg.orange,
      colours.bg.black
    )
  );
  if (file == "") {
    return;
  }
  const secondFile = prompt(
    color(
      locale_1.locale.InputFileName,
      false,
      colours.fg.orange,
      colours.bg.black
    )
  );
  if (secondFile == "") {
    return;
  }
  let startTime = hrtime();
  let FilePath1 = constants.SC + file + ".sc";
  if (!existsSync(FilePath1)) {
    return prompt(locale_1.locale.nofile.replace("%s", FilePath1));
  }
  let FilePath2 = constants.SC + secondFile + ".sc";
  if (!existsSync(constants.SC + secondFile + ".sc")) {
    return prompt(locale_1.locale.nofile.replace("%s", FilePath2));
  }

  // File loading
  let baseSWF = new SupercellSWF().load(FilePath1);
  let secondSWF = new SupercellSWF().load(FilePath2);
  baseSWF.compression = COMPRESSION.FAST_LZMA;

  let maxID = Math.max(...Object.keys(baseSWF.resources)) + 1;

  //Resources
  for (let resourceID in secondSWF.resources) {
    let resource = secondSWF.resources[resourceID];

    if (resource instanceof MovieClip) {
      for (let bind of resource.binds) {
        bind.id += maxID;
      }
      resource.bankIndex += baseSWF.banks.length;
    } else if (resource instanceof Shape) {
      for (let bitmap of resource.bitmaps) {
        bitmap.textureIndex += baseSWF.textures.length;
      }
    }

    baseSWF.resources[parseInt(resourceID) + maxID] = resource;
  }

  //Textures
  for (let texture of secondSWF.textures) {
    baseSWF.textures.push(texture);
  }

  //Transforms
  for (let bank of secondSWF.banks) {
    baseSWF.banks.push(bank);
  }

  //Exports
  for (let exportName of secondSWF.exports.getExports()) {
    for (let exportName2 of baseSWF.exports.getExports()) {
      if (exportName == exportName2) {
        baseSWF.exports.removeExport(exportName2);
      }
    }
    baseSWF.exports.addExport(
      secondSWF.exports.getExportId(exportName) + maxID,
      exportName
    );
  }
  baseSWF.hasLowresTexture = false;
  baseSWF.useUncommonTexture = false;
  baseSWF.compression = config_1.config.defaultCompression;
  baseSWF.save(constants.SC + `${file}_${secondFile}.sc`);
  print(
    locale_1.locale.format(locale_1.locale.done, hrtime(startTime)),
    false,
    colours.fg.black,
    colours.bg.green
  );
  prompt(
    color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black)
  );
}

function SC_DEC_CMP() {
  const file = prompt(
    color(
      locale_1.locale.InputFileName,
      false,
      colours.fg.orange,
      colours.bg.black
    )
  );
  if (file == "") {
    return;
  }
  let startTime = hrtime();
  let FilePath = constants.SC + file + ".sc";
  if (!existsSync(FilePath)) {
    return prompt(locale_1.locale.nofile.replace("%s", FilePath));
  }
  let buffer = ScBuffer.fromSc(FilePath);
  let dec = true;
  if (buffer[1] == 1) {
    print(
      locale_1.locale.Cmp + "LZMA",
      false,
      colours.fg.green,
      colours.bg.black
    );
  } else if (buffer[1] == 2) {
    print(
      locale_1.locale.Cmp + "FAST_LZMA",
      false,
      colours.fg.green,
      colours.bg.black
    );
  } else if (buffer[1] == 0) {
    print(
      locale_1.locale.Cmp + "NONE",
      false,
      colours.fg.green,
      colours.bg.black
    );
    dec = false;
  }
  if (dec) {
    print(locale_1.locale.Decmpr, false, colours.fg.green, colours.bg.black);
    ScBuffer.toSc(
      constants.SC + file + "_old.sc",
      buffer[0],
      config_1.config.defaultCompression
    );
    writeFileSync(FilePath, buffer[0]["_buff"]);
  } else {
    print(locale_1.locale.Cmpr, false, colours.fg.green, colours.bg.black);
    ScBuffer.toSc(FilePath, buffer[0], config_1.config.defaultCompression);
  }
  print(
    locale_1.locale.format(locale_1.locale.done, hrtime(startTime)),
    false,
    colours.fg.black,
    colours.bg.green
  );
  prompt(
    color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black)
  );
}

function getexports() {
  const file = prompt(
    color(
      locale_1.locale.InputFileName,
      false,
      colours.fg.orange,
      colours.bg.black
    )
  );
  if (file == "") {
    return;
  }
  let FilePath = constants.SC + file + ".sc";
  let IDS = [];
  if (!existsSync(FilePath)) {
    return prompt(locale_1.locale.nofile.replace("%s", FilePath));
  }
  let swf = new SupercellSWF();
  let swf2 = new SupercellSWF();
  let bankindex = 0;
  let bank = new TransformBank();
  swf2.banks.push(bank);
  let pon = true;
  let Exports = [];
  const Export = prompt(
    color(
      locale_1.locale.InputExportName,
      false,
      colours.fg.orange,
      colours.bg.black
    )
  );
  if (Export == "") {
    return;
  }
  swf.load(FilePath);
  Exports.push(Export);
  blackids = [];
  blackExports = [];
  while (pon) {
    IDS = [];
    for (let Export2 of Exports) {
      for (let export1 of swf.exports.getExports()) {
        if (export1.includes(Export2)) {
          if (!IDS.includes(swf.exports.getExportId(export1))) {
            IDS.push(swf.exports.getExportId(export1));
          }
        }
      }
    }
    for (id of blackids) {
      IDS.splice(IDS.indexOf(id), 1);
    }
    for (let Export3 of blackExports) {
      for (id of IDS) {
        for (let Export4 of swf.exports.getExportsById(id))
          if (Export4.includes(Export3)) {
            IDS.splice(IDS.indexOf(id), 1);
          }
      }
    }
    print("IDS:", true, colours.fg.green, colours.bg.black);
    for (id of IDS) {
      console.log(
        "\u001B[33mID:" +
          id +
          "     " +
          "Export: " +
          swf.exports.getExportsById(id) +
          "\u001B[0m"
      );
    }
    console.log("\n");
    console.log("Exports: " + Exports);
    console.log("Black IDS: " + blackids);
    console.log("Black Exports: " + blackExports);
    console.log("\n");
    let op = prompt("1: Add Export\n2: Remove Export\nEnter: next\n>>>");
    if (op == 1) {
      let Export1 = prompt(
        color(
          locale_1.locale.InputExportName,
          false,
          colours.fg.orange,
          colours.bg.black
        )
      );
      if (isNaN(Export1)) {
        if (blackExports.includes(Export1)) {
          blackExports.splice(blackExports.indexOf(Export1), 1);
        }
        Exports.push(Export1);
      } else {
        if (blackids.includes(Export1)) {
          blackids.splice(blackids.indexOf(Export1), 1);
        }
        IDS.push(+Export1);
      }
    } else if (op == 2) {
      let Export1 = prompt(
        color(
          locale_1.locale.InputExportName,
          false,
          colours.fg.orange,
          colours.bg.black
        )
      );
      if (isNaN(Export1)) {
        if (Exports.includes(Export1)) {
          Exports.splice(Exports.indexOf(Export1), 1);
        }
        blackExports.push(Export1);
      } else {
        if (Exports.includes(Export1)) {
          Exports.splice(Exports.indexOf(Export1), 1);
        }
        blackids.push(Export1);
      }
    } else if (op == "") {
      pon = false;
    } else {
      console.log("Wrong option");
    }
  }
  let startTime = hrtime();
  for (id of IDS) {
    let resource = swf.resources[id];
    if (resource instanceof MovieClip) {
      if (swf.exports.getExportsById(id) != undefined) {
        for (let Export1 of swf.exports.getExportsById(id)) {
          swf2.exports.addExport(id, Export1);
          console.info("\u001B[33m" + Export1 + locale_1.locale.AddedMC);
        }
      } else {
        console.info("\u001B[33mID:" + id + locale_1.locale.AddedMC);
      }
      for (bind of resource.binds) {
        if (!IDS.includes(bind["id"])) {
          IDS.push(bind["id"]);
        }
      }
      for (frame of resource.frames) {
        for (element of frame.elements) {
          if (element["matrix"] != undefined) {
            element["matrix"] = swf2.banks[bankindex].addMatrix(
              swf.banks[resource.bankIndex].matrices[element["matrix"]]
            );
            if (element["matrix"] == undefined) {
              bankindex++;
              swf2.banks.push(bank);
              swf2.banks[bankindex].matrices = [];
              swf2.banks[bankindex].colors = [];
              for (frame of resource.frames) {
                for (element of frame.elements) {
                  if (element["matrix"] != undefined) {
                    element["matrix"] = swf2.banks[bankindex].addMatrix(
                      swf.banks[resource.bankIndex].matrices[element["matrix"]]
                    );
                    if (element["matrix"] == undefined) {
                      bankindex++;
                      swf2.banks.push(bank);
                      swf2.banks[bankindex].matrices = [];
                      Console.log("Пиздец");
                    }
                  }
                }
              }
            }
          }
          if (element["color"] != undefined) {
            element["color"] = swf2.banks[bankindex].addColor(
              swf.banks[resource.bankIndex].colors[element["color"]]
            );
            if (element["color"] == undefined) {
              bankindex++;
              swf2.banks.push(bank);
              swf2.banks[bankindex].matrices = [];
              swf2.banks[bankindex].colors = [];
              for (frame of resource.frames) {
                for (element of frame.elements) {
                  if (element["color"] != undefined) {
                    element["color"] = swf2.banks[bankindex].addColor(
                      swf.banks[resource.bankIndex].colors[element["color"]]
                    );
                    if (element["color"] == undefined) {
                      Console.log("Пиздец");
                    }
                  }
                }
              }
            }
          }
        }
      }
      resource.bankIndex = bankindex;
    }
    if (resource instanceof Shape) {
      console.info("\u001B[33mID:" + id + locale_1.locale.AddedSh);
      for (bitmap of resource.bitmaps) {
        if (!swf2.textures.includes(swf.textures[bitmap.textureIndex])) {
          swf2.textures.push(swf.textures[bitmap.textureIndex]);
        }
        bitmap.textureIndex = swf2.textures.indexOf(
          swf.textures[bitmap.textureIndex]
        );
      }
    }
    if (resource instanceof TextField) {
      console.info("\u001B[33mID:" + id + locale_1.locale.AddedTx);
    }
    if (resource instanceof MovieClipModifier) {
      console.info("\u001B[33mID:" + id + locale_1.locale.AddedSh);
    }
    swf2.resources[id] = resource;
  }
  swf2.compression = config_1.config.defaultCompression;
  swf2.hasExternalTexture = swf.hasExternalTexture;
  swf2.hasLowresTexture = false;
  swf2.useUncommonTexture = false;
  print("Final Exports:", true, colours.fg.green, colours.bg.black);
  for (id of swf2.exports.getIds()) {
    console.log(
      "\u001B[33mID:" +
        id +
        "     " +
        "Export: " +
        swf.exports.getExportsById(id) +
        "\u001B[0m"
    );
  }
  swf2.save(constants.SC + file + "_" + Export + ".sc");
  print(
    locale_1.locale.format(locale_1.locale.done, hrtime(startTime)),
    false,
    colours.fg.black,
    colours.bg.green
  );
  prompt(
    color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black)
  );
}
module.exports = {
  mergeFiles,
  getexports,
  SC_DEC_CMP,
};
