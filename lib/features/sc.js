const { existsSync , writeFileSync} = require("fs");
const { SupercellSWF, MovieClip, Shape, ScBuffer, COMPRESSION } = require("supercell-swf");
const {
	hrtime
} = require("process");
const {
	print,
	colours,
	color
} = require("../console");
const locale_1 = require("../locale");
const prompt = require('prompt-sync')();
const constants = require("../constants");
function mergeFiles() {
    const file = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
    if (file==""){
		return
	}
    const secondFile = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
    if (secondFile==""){
		return
	}
    let startTime =hrtime();
    let FilePath1 = constants.SC+file+".sc"
    if (!existsSync(FilePath1)) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath1))
	}
    let FilePath2 = constants.SC+secondFile+".sc"
    if (!existsSync(constants.SC+secondFile+".sc")) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath2))
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
                if (exportName==exportName2){
                    baseSWF.exports.removeExport(exportName2)
                }
        }
        baseSWF.exports.addExport(secondSWF.exports.getExportId(exportName) + maxID, exportName);
    }

    baseSWF.save(constants.SC+`${file}_${secondFile}.sc`);
    print(locale_1.locale.format(locale_1.locale.done, hrtime(startTime)), false, colours.fg.black, colours.bg.green);
    prompt(color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black))
}
function SC_DEC_CMP(){
    const file = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
    if (file==""){
		return
	}
    let startTime = hrtime();
    let FilePath = constants.SC+file+".sc"
    if (!existsSync(FilePath)) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath))
	}
    let buffer = ScBuffer.fromSc(FilePath)
    let dec = true
    if(buffer[1]==1){
        print(locale_1.locale.Cmp + "LZMA", false, colours.fg.green, colours.bg.black);
    }else if(buffer[1]==2){
        print(locale_1.locale.Cmp + "FAST_LZMA", false, colours.fg.green, colours.bg.black);
    }else if(buffer[1]==0){
        print(locale_1.locale.Cmp + "NONE", false, colours.fg.green, colours.bg.black);
        dec=false
    }
    if (dec){
        print(locale_1.locale.Decmpr, false, colours.fg.green, colours.bg.black);
        ScBuffer.toSc(constants.SC+file+"_old.sc",buffer[0],COMPRESSION.FAST_LZMA)
        writeFileSync(FilePath, buffer[0]["_buff"]);
    }else{
        print(locale_1.locale.Cmpr, false, colours.fg.green, colours.bg.black);
        ScBuffer.toSc(FilePath,buffer[0],COMPRESSION.FAST_LZMA)
    }
    print(locale_1.locale.format(locale_1.locale.done, hrtime(startTime)), false, colours.fg.black, colours.bg.green);
    prompt(color(locale_1.locale.toContinue, false, colours.fg.green, colours.bg.black))
}
module.exports = {
	mergeFiles,
    SC_DEC_CMP
}