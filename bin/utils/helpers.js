"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genOutputFileName = exports.isVideoFile = exports.showMessage = exports.header = void 0;
const path_1 = __importDefault(require("path"));
// Dynamic import for chalk
const chalk = import("chalk").then((m) => m.default);
// TODO: fix header color
exports.header = `
  ██╗   ██╗██╗██████╗ ███████╗ ██████╗     ███████╗██████╗ ██╗     ██╗████████╗████████╗███████╗██████╗ 
  ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗    ██╔════╝██╔══██╗██║     ██║╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
  ██║   ██║██║██║  ██║█████╗  ██║   ██║    ███████╗██████╔╝██║     ██║   ██║      ██║   █████╗  ██████╔╝
  ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║    ╚════██║██╔═══╝ ██║     ██║   ██║      ██║   ██╔══╝  ██╔══██╗
   ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝    ███████║██║     ███████╗██║   ██║      ██║   ███████╗██║  ██║
    ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝     ╚══════╝╚═╝     ╚══════╝╚═╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝
                          A command line tool for cutting videos into segments of a specified duration.                                                                                                        
`;
/**
 * Displays a formatted console message based on the specified message type.
 *
 * @param message - The message to be displayed.
 * @param type - The type of the message, which can be "error," "success," or "warn."
 */
const showMessage = async (message, type) => {
    const _chalk = await chalk;
    if (type === "success")
        return console.log(_chalk.bold.green(`\nSUCESS: ${message}`));
    if (type === "info")
        return console.log(_chalk.bold.yellow(`\nINFO: ${message}`));
    if (type === "warn")
        return console.log(_chalk.bold.hex("FFA500")(`\nWARNING: ${message}`));
    if (type === "error")
        return console.log(_chalk.bold.red(`\nERROR: ${message}`));
};
exports.showMessage = showMessage;
/**
 * Checks if the given file path corresponds to a video file based on its extension.
 *
 * @param filePath - The path to the file.
 * @returns - A boolean indicating whether the file is a video file.
 */
const isVideoFile = (filePath) => {
    const videoExtensions = [".mp4", ".avi", ".mkv"];
    const ext = path_1.default.extname(filePath).toLowerCase();
    return videoExtensions.includes(ext);
};
exports.isVideoFile = isVideoFile;
/**
 * Generates the output file name for a trimmed video segment based on the input video path and trim count.
 *
 * @param videoPath - The path to the input video.
 * @param trimCount - The index of the trim segment.
 * @returns - The generated output file name.
 */
const genOutputFileName = (videoPath, trimCount) => {
    const fileName = path_1.default.parse(videoPath).name;
    const fileExt = path_1.default.extname(videoPath);
    return `${fileName}_${trimCount}${fileExt}`;
};
exports.genOutputFileName = genOutputFileName;
