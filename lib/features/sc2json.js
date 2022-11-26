const {
	SupercellSWF,
	MovieClip,
} = require("supercell-swf");
const {
	readFileSync
} = require("fs");
const {
	hrtime
} = require("process");
const {
	print,
	colours,
	color
} = require("../console");
const locale_1 = require("../locale");
const {
	writeFileSync
} = require("fs");
const fs = require("fs");
const prompt = require('prompt-sync')();
const constants = require("../constants");
function tojson(){
    FileName = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
    if (FileName==""){
		return
	}
    let time = process.hrtime();
    FilePath = constants.SC+FileName+".sc"
    if (!fs.existsSync(FilePath)) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath))
	}
    // Initializing and loading file to instance
    let swf = new SupercellSWF()
        .loadAsset(FilePath);
    print(locale_1.locale.format(locale_1.locale.LoadingTook, hrtime(time)), false, colours.fg.black, colours.bg.green);
    time = hrtime();
    let json = JSON.stringify(swf.toJSON(true), null, 2);
    writeFileSync(constants.JSON+FileName+".json", json);
    if (hrtime(time)<1){
        print(locale_1.locale.format(locale_1.locale.LoadingJson, hrtime(time)), false, colours.fg.black, colours.bg.green);
    }
    prompt(color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black))
}

function toSc(){
    let swf = new SupercellSWF();
    FileName = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
    let time = process.hrtime();
    FilePath = constants.JSON+FileName+".json"
    if (FileName==""){
		return
	}
    if (!fs.existsSync(FilePath)) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath))
	}
    json = readFileSync(FilePath)
    swf.fromJSON(JSON.parse(json));
    for (let id in swf.resources) {
        // Get object itself
        let instance = swf.resources[id];

        // Make sure it's a MovieClip
        if (instance instanceof MovieClip) {
            //for (const frame of instance.frames) {console.log(frame.elements)}
            instance.toBank(swf)
            //for (const frame of instance.frames) {console.log(frame.elements)}
        }
    }
    swf.saveAsset(constants.SC+FileName+".sc");
    print(locale_1.locale.format(locale_1.locale.LoadingSc, hrtime(time)), false, colours.fg.black, colours.bg.green);
    prompt(color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black))
}

module.exports = {
	tojson,
    toSc
}