"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textureEncode = exports.texturesDecode = void 0;
const prompt = require('prompt-sync')({ sigint: true });
const fs = require("fs");
const path = require("path");
const process_1 = require("process");
const supercell_swf_1 = require("supercell-swf");
const console_1 = require("../console");
const locale_1 = require("../locale");
const utils_1 = require("./utils");
const PNG = require("fast-png");
const image_js_1 = require("image-js");
const config_1 = require("../config");
const constants = require("../constants");
const {
	SupercellSWF,
} = require("supercell-swf");
const {
	color,
	colours
} = require("../console");
function texturesDecode(options = { inPath:constants.SC, outPath: constants.TEXTURES, output: true }) {
	options.output = true
	options.inPath = constants.SC
	options.outPath = constants.TEXTURES
	let FileName = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
	if (FileName==""){
		return
	}
	options.inPath+=FileName+"_tex.sc"
	if (!fs.existsSync(options.inPath)) {
		return prompt(locale_1.locale.nofile.replace("%s",options.inPath))
	}
	const startTime = (0, process_1.hrtime)();
	const folder = `${options.outPath}/${FileName}`;
	if (fs.existsSync(folder)) {
		fs.rmSync(folder, { recursive: true, force: true });
            }
	fs.mkdirSync(folder);
	const infoFile = [];
	const swf = (0, utils_1.createSWF)(options.output).loadExternalTexture(`${options.inPath}`);
	(0, console_1.trace)(locale_1.locale.imageSaving, { textColor: console_1.colors.green });
	for (let i = 0; swf.textures.length > i; i++) {
			const texture = swf.textures[i];
			fs.writeFileSync(`${folder}/${FileName}${'_'.repeat(i)}.png`, texture.image.toBuffer());
			infoFile.push(texture.toJSON());
            }
	fs.writeFileSync(`${folder}/${FileName}.json`, JSON.stringify(infoFile, null, 2));
	if (options.output) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		(0, console_1.trace)(locale_1.locale.done, { center: false, textColor: console_1.colors.black, bgColor: console_1.bgColors.green, localeStrings: [(0, process_1.hrtime)(startTime).join(',')] });
	}
    if (options.output) {
        prompt(locale_1.locale.toContinue);
	}
}
exports.texturesDecode = texturesDecode;
function textureEncode(options = { inPath: constants.SC, outPath: constants.TEXTURES, output: true }) {
	let folderName = prompt(color(locale_1.locale.InputFoldderName, false, colours.fg.orange, colours.bg.black))
	if (folderName==""){
		return
	}
	options.inPath = constants.TEXTURES
	options.outPath = constants.SC
	options.output = true
	options.inPath+="/"+folderName
	if (!fs.existsSync(options.inPath)) {
		return prompt(locale_1.locale.nofile.replace("%s",options.inPath))
	}
	const startTime = (0, process_1.hrtime)();
	const swf = (0, utils_1.createSWF)(options.output);
	swf.compression = config_1.config.defaultCompression;
	const folder = `${options.inPath}`;
	const dirContent = fs.readdirSync(folder);
	let texturesInfo = dirContent.includes(`${folderName}.json`) ? require(`${path.resolve(folder)}/${folderName}.json`) : [];
	let textureIndex = 0;
	for (const file of dirContent) {
		if (file.endsWith('.png')) {
			const texture = new supercell_swf_1.Texture();
			const image = PNG.decode(fs.readFileSync(`${folder}/${file}`));
			texture.image = new image_js_1.Image(image.width, image.height, image.data, {
			components: image.channels % 2 === 0 ? image.channels - 1 : image.channels,
			alpha: image.channels % 2 === 0 ? 1 : 0,
			bitDepth: image.depth,
			});
			let textureInfo = texturesInfo[textureIndex];
			if (textureInfo !== undefined) {
				const width = textureInfo.width;
				const height = textureInfo.height;
				if (width && height) {
					if (width !== texture.width || height !== texture.height) {
						let resize = true;
							if (options.output) {
								(0, console_1.trace)(locale_1.locale.illegalSize, { localeStrings: [width, height, texture.width, texture.height] });
									resize = (0, console_1.question)(locale_1.locale.resize_qu);
							}
							if (!resize) {
								textureInfo.width = texture.width;
								textureInfo.height = texture.height;
						}
					}
				}
				texture.fromJSON(textureInfo);
			}
			swf.textures.push(texture);
			textureIndex++;
		}

	}
	swf.saveExternalTexture(`${options.outPath}/${folderName}_tex.sc`, false);
	if (options.output) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		(0, console_1.trace)(locale_1.locale.done, { center: false, textColor: console_1.colors.black, bgColor: console_1.bgColors.green, localeStrings: [(0, process_1.hrtime)(startTime).join(',')] });
        prompt(locale_1.locale.toContinue);
	}
}
exports.textureEncode = textureEncode;
function TexOptimization(){
	let FileName = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
	if (FileName==""){
		return
	}
	let swf = new SupercellSWF();
	const startTime = (0, process_1.hrtime)();
	let FilePath=constants.SC+FileName+".sc"
	if (!fs.existsSync(FilePath)) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath))
	}
	swf.load(FilePath)
	for (let tex of swf.textures) {
		if (tex.image.channels==3){
			tex.pixelFormat="GL_RGB565"
		}
		if (tex.image.channels==4){
			tex.pixelFormat="GL_RGBA4"
		}
    }
	swf.save(FilePath=constants.SC+FileName+"_op.sc")

	console_1.trace(locale_1.locale.done, { center: false, textColor: console_1.colors.black, bgColor: console_1.bgColors.green, localeStrings: [(0, process_1.hrtime)(startTime).join(',')] });
	prompt(locale_1.locale.toContinue);
}
exports.TexOptimization = TexOptimization;
function Postfixchange(){
	let FileName = prompt(color(locale_1.locale.InputFileName, false, colours.fg.orange, colours.bg.black))
	if (FileName==""){
		return
	}
	let FilePath=constants.SC+FileName+".sc"
	const startTime = (0, process_1.hrtime)();
	if (!fs.existsSync(FilePath)) {
		return prompt(locale_1.locale.nofile.replace("%s",FilePath))
	}
	let swf = new SupercellSWF()
        .loadAsset(FilePath);
	let postfix = prompt(color(locale_1.locale.InputPostfix, false, colours.fg.orange, colours.bg.black))
	swf.hasExternalTexture = true;
	swf.hasLowresTexture = true;
	swf.useUncommonTexture = true;
	swf.highresPostfix = postfix
	swf.lowresPostfix = postfix
	//swf.compression = supercell_swf_1.COMPRESSION.NONE
	swf.saveAsset(FilePath)
	console_1.trace(locale_1.locale.done, { center: false, textColor: console_1.colors.black, bgColor: console_1.bgColors.green, localeStrings: [(0, process_1.hrtime)(startTime).join(',')] });
	prompt(locale_1.locale.toContinue);
}
exports.Postfixchange = Postfixchange;