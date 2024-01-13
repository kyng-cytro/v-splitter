import path from "path";
import fs from "fs";
import { Command } from "commander";
import { header, isVideoFile, showMessage } from "./utils/helpers";
import { run } from "./utils/ffmpeg";

export const program = new Command();

program
  .name("video-splitter")
  .description(header)
  .option("-v, --video <path>", "video path")
  .option(
    "-d, --duration [seconds]",
    "preferred duration in seconds (default is 30)"
  )
  .option(
    "-o, --output [path]",
    "output folder path (default is current working directory)"
  )
  .option(
    "--no-folder",
    "place output files directly in the output directory without creating a folder"
  )
  .action(
    async (opts: {
      video: string;
      duration: number;
      output: string;
      folder: boolean;
    }) => {
      const videoPath: string = opts.video || "";
      const preferredDuration: number = Number(opts.duration || 30);
      const outputFolderPath: string = path.resolve(
        opts.output || process.cwd()
      );
      const outputInFolder: boolean = opts.folder !== false;

      // Check if video file exists and has a valid extension
      if (!videoPath || !fs.existsSync(videoPath) || !isVideoFile(videoPath)) {
        await showMessage(
          "Please provide a valid video file path. or try -h",
          "error"
        );
        process.exit(1);
      }

      // Check if duration is a positive number
      if (isNaN(preferredDuration) || preferredDuration <= 0) {
        await showMessage(
          "Please provide a valid positive duration in seconds.",
          "error"
        );
        process.exit(1);
      }

      // Check if output folder exists
      if (
        !fs.existsSync(outputFolderPath) ||
        !fs.statSync(outputFolderPath).isDirectory()
      ) {
        await showMessage(
          "Please provide a valid output folder path.",
          "error"
        );
        process.exit(1);
      }

      console.log("");
      console.log(header);

      run(videoPath, outputFolderPath, preferredDuration, outputInFolder);
    }
  );
