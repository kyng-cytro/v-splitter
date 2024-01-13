import path from "path";

// Dynamic import for chalk
const chalk = import("chalk").then((m) => m.default);

// TODO: fix header color
export const header = `
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
export const showMessage = async (
  message: string,
  type: "success" | "info" | "warn" | "error",
) => {
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

export const isVideoFile = (filePath: string): boolean => {
  const videoExtensions = [".mp4", ".avi", ".mkv"]; // Add more extensions if needed
  const ext = path.extname(filePath).toLowerCase();
  return videoExtensions.includes(ext);
};

export const genOutputFileName = (
  videoPath: string,
  trimCount: number,
): string => {
  const fileName = path.parse(videoPath).name;
  const fileExt = path.extname(videoPath);

  return `${fileName}_${trimCount}${fileExt}`;
};
