"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs = require("fs");
const { COMPRESSION } = require("supercell-swf");
const other_1 = require("./features/other");
const locale_1 = require("./locale");
const { selectFromArray } = require("./console");
class Config {
  constructor() {
    this.version = "1.6.9";
    this.defaultCompression = COMPRESSION.FAST_LZMA;
    this.language = "en-EU";
  }
  initialize() {
    if (fs.existsSync("./config.json")) {
      const configFile = require("../config.json");
      Object.assign(this, configFile);
      locale_1.locale.load(this.language);
    } else {
      this.language = locale_1.locale.change();
      (0, other_1.makeDirs)();
      this.dump();
    }
  }
  selectLanguage() {
    this.language = locale_1.locale.change();
    locale_1.locale.load(this.language);
    this.dump();
  }
  selectCompression() {
    this.defaultCompression = [
      COMPRESSION.FAST_LZMA,
      COMPRESSION.LZMA,
      COMPRESSION.NONE,
    ][
      selectFromArray(
        ["FAST_LZMA", "LZMA", "NONE"],
        [
          "Fast but bigger file size",
          "Slow but small file size",
          "No compression(Game will crush)",
        ]
      )
    ];
    this.dump();
  }
  dump() {
    fs.writeFileSync(
      "./config.json",
      JSON.stringify({
        version: this.version,
        language: this.language,
        defaultCompression: this.defaultCompression,
      })
    );
  }
}
exports.config = new Config();
