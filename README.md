# Video Splitter

A command line tool for cutting videos into segments of a specified duration, ideal for WhatsApp statuses.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- Cut long videos into shorter segments.
- Specify the preferred duration for each segment.
- Multiple aliases `v-split`, `v-splitter`, `video-splitter`.
- Choose whether to output segments in a separate folder or directly in the output directory.
- Ideal for creating videos suitable for WhatsApp statuses.

## Requirements

- Node.js (version 18.18.0 or higher)
- npm (version 9.8.1 or higher)

## Installation

```bash
  npm install -g video-splitter
```

## Usage

```bash
v-split -v /path/to/video.mp4 -d 45 -o /path/to/output --no-folder
```

## Options

- `-v, --video <path>`: Path to the input video file.
- `-d, --duration [seconds]`: Preferred duration for each trimmed segment in seconds (default is 30).
- `-o, --output [path]`: Output folder path (default is current working directory).
- `--no-folder`: Place output files directly in the output directory without creating a folder.

## Examples

- Trim a video into 45-second segments and place them directly in the output directory:

  ```bash
  v-split -v /path/to/video.mp4 -d 45 -o /path/to/output --no-folder
  ```

- Trim a video into 30-second segments and organize them in a separate folder:

  ```bash
  v-split -v /path/to/video.mp4 -d 30 -o /path/to/output
  ```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a pull request.

## License

This project is licensed under the MIT License.
