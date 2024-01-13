"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const pathToFfmpeg = require("ffmpeg-static");
const pathToFfprobe = require("ffprobe-static");
const helpers_1 = require("./helpers");
// Set bins
fluent_ffmpeg_1.default.setFfmpegPath(pathToFfmpeg);
fluent_ffmpeg_1.default.setFfprobePath(pathToFfprobe.path);
/**
 * Splits a video into segments based on the specified duration and saves the trimmed segments.
 *
 * @param videoPath - The path to the input video.
 * @param outputPath - The directory where the trimmed video segments will be saved.
 * @param trimDuration - The duration (in seconds) of each trimmed video segment.
 * @param useFolder - Indicates whether to use a separate folder for the trimmed segments (default is true).
 */
const run = async (videoPath, outputPath, trimDuration, useFolder = true) => {
    try {
        // Get the duration of the input video
        const { duration } = await getDuration(videoPath);
        // Divide the duration into segments
        const trims = divideDuration(duration, trimDuration);
        await (0, helpers_1.showMessage)(`Splitting video into ${trims.length} pieces of ${trimDuration} seconds videos.`, "info");
        // Create promises for each trim operation
        const promises = trims.map((trim, i) => trimVideoSegment(i + 1, trim, videoPath, outputPath, trimDuration, useFolder));
        // Wait for all trim promises to complete
        await Promise.all(promises);
        await (0, helpers_1.showMessage)(`Split completed.`, "success");
    }
    catch (e) {
        await (0, helpers_1.showMessage)(`Something went wrong. ${e.message}`, "error");
        process.exit(1);
    }
};
exports.run = run;
/**
 * Trims a segment from a video based on the specified parameters and saves the trimmed segment.
 *
 * @param trimCount - The index of the trim operation.
 * @param seekValue - The starting point (in seconds) from which to trim the video.
 * @param videoPath - The path to the input video.
 * @param outputPath - The directory where the trimmed video segment will be saved.
 * @param trimDuration - The duration (in seconds) of the trimmed video segment (default is 30 seconds).
 * @param useFolder - Indicates whether to use a separate folder for the trimmed segment (default is true).
 * @returns A promise that resolves with the path to the saved trimmed video segment.
 */
const trimVideoSegment = (trimCount, seekValue, videoPath, outputPath, trimDuration = 30, useFolder = true) => {
    // Create folder if needed
    if (!fs_1.default.existsSync(path_1.default.join(outputPath, "split-output")) && useFolder) {
        fs_1.default.mkdirSync(path_1.default.join(outputPath, "split-output"), { recursive: true });
    }
    // Create file path
    // TODO: use file name and extention
    const outPath = useFolder
        ? path_1.default.join(outputPath, "split-output", (0, helpers_1.genOutputFileName)(videoPath, trimCount))
        : path_1.default.join(outputPath, (0, helpers_1.genOutputFileName)(videoPath, trimCount));
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(videoPath)
            .output(outPath)
            .seekInput(seekValue)
            .duration(trimDuration)
            .on("end", () => {
            resolve({ outPath });
        })
            .on("error", async function (err) {
            await (0, helpers_1.showMessage)(`An error occured on trim ${trimCount}.\nmessage: ${err.message}.`, "warn");
            reject(new Error(err.message));
        })
            .run();
    });
};
/**
 * Retrieves the duration of a video file.
 *
 * @param videoPath - The path to the input video.
 * @returns - A promise that resolves with the duration of the video.
 */
const getDuration = (videoPath) => {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(videoPath).ffprobe((err, data) => {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            const video = data.streams.find((s) => s.codec_type === "video");
            if (!video) {
                reject(new Error("No video stream found"));
                return;
            }
            const duration = Number(data.format?.duration);
            resolve({ duration });
        });
    });
};
/**
 * Divides the duration of a video into segments based on a preferred duration.
 *
 * @param videoDuration - The total duration of the video.
 * @param preferredDuration - The preferred duration for each segment (default is 30 seconds).
 * @returns - An array containing the start times for each segment.
 */
const divideDuration = (videoDuration, trimDuration = 30) => {
    const result = [];
    for (let i = 0; i < videoDuration; i += trimDuration) {
        result.push(i);
    }
    return result;
};
