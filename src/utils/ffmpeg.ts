import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
const pathToFfmpeg = require("ffmpeg-static");
const pathToFfprobe = require("ffprobe-static");
import { genOutputFileName, showMessage } from "./helpers";

// Set bins
ffmpeg.setFfmpegPath(pathToFfmpeg!);
ffmpeg.setFfprobePath(pathToFfprobe.path);

/**
 * Splits a video into segments based on the specified duration and saves the trimmed segments.
 *
 * @param videoPath - The path to the input video.
 * @param outputPath - The directory where the trimmed video segments will be saved.
 * @param trimDuration - The duration (in seconds) of each trimmed video segment.
 * @param useFolder - Indicates whether to use a separate folder for the trimmed segments (default is true).
 */
export const run = async (
  videoPath: string,
  outputPath: string,
  trimDuration: number,
  useFolder = true,
) => {
  try {
    // Get the duration of the input video
    const { duration } = await getDuration(videoPath);

    // Divide the duration into segments
    const trims = divideDuration(duration, trimDuration);

    await showMessage(
      `Splitting video into ${trims.length} pieces of ${trimDuration} seconds videos.`,
      "info",
    );

    // Create promises for each trim operation
    const promises = trims.map((trim, i) =>
      trimVideoSegment(
        i + 1,
        trim,
        videoPath,
        outputPath,
        trimDuration,
        useFolder,
      ),
    );

    // Wait for all trim promises to complete
    await Promise.all(promises);

    await showMessage(`Split completed.`, "success");
  } catch (e: any) {
    await showMessage(`Something went wrong. ${e.message}`, "error");
    process.exit(1);
  }
};

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
const trimVideoSegment = (
  trimCount: number,
  seekValue: number,
  videoPath: string,
  outputPath: string,
  trimDuration = 30,
  useFolder = true,
) => {
  // Create folder if needed
  if (!fs.existsSync(path.join(outputPath, "split-output")) && useFolder) {
    fs.mkdirSync(path.join(outputPath, "split-output"), { recursive: true });
  }

  // Create file path
  // TODO: use file name and extention
  const outPath = useFolder
    ? path.join(
        outputPath,
        "split-output",
        genOutputFileName(videoPath, trimCount),
      )
    : path.join(outputPath, genOutputFileName(videoPath, trimCount));

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outPath)
      .seekInput(seekValue)
      .duration(trimDuration)
      .on("end", () => {
        resolve({ outPath });
      })
      .on("error", async function (err) {
        await showMessage(
          `An error occured on trim ${trimCount}.\nmessage: ${err.message}.`,
          "warn",
        );
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
const getDuration = (videoPath: string): Promise<{ duration: number }> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath).ffprobe((err, data) => {
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
const divideDuration = (videoDuration: number, trimDuration = 30) => {
  const result: number[] = [];
  for (let i = 0; i < videoDuration; i += trimDuration) {
    result.push(i);
  }
  return result;
};
