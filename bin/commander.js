"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const commander_1 = require("commander");
const helpers_1 = require("./utils/helpers");
const ffmpeg_1 = require("./utils/ffmpeg");
exports.program = new commander_1.Command();
exports.program
    .name("video-splitter")
    .description(helpers_1.header)
    .option("-v, --video <path>", "video path")
    .option("-d, --duration [seconds]", "preferred duration in seconds (default is 30)")
    .option("-o, --output [path]", "output folder path (default is current working directory)")
    .option("--no-folder", "place output files directly in the output directory without creating a folder")
    .action(async (opts) => {
    const videoPath = opts.video || "";
    const preferredDuration = Number(opts.duration || 30);
    const outputFolderPath = path_1.default.resolve(opts.output || process.cwd());
    const outputInFolder = opts.folder !== false;
    // Check if video file exists and has a valid extension
    if (!videoPath || !fs_1.default.existsSync(videoPath) || !(0, helpers_1.isVideoFile)(videoPath)) {
        await (0, helpers_1.showMessage)("Please provide a valid video file path. or try -h", "error");
        process.exit(1);
    }
    // Check if duration is a positive number
    if (isNaN(preferredDuration) || preferredDuration <= 0) {
        await (0, helpers_1.showMessage)("Please provide a valid positive duration in seconds.", "error");
        process.exit(1);
    }
    // Check if output folder exists
    if (!fs_1.default.existsSync(outputFolderPath) ||
        !fs_1.default.statSync(outputFolderPath).isDirectory()) {
        await (0, helpers_1.showMessage)("Please provide a valid output folder path.", "error");
        process.exit(1);
    }
    console.log("");
    console.log(helpers_1.header);
    (0, ffmpeg_1.run)(videoPath, outputFolderPath, preferredDuration, outputInFolder);
});
