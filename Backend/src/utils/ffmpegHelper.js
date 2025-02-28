import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const convertToHLS = (inputPath, outputFolder) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

    ffmpeg(inputPath)
      .output(`${outputFolder}/index.m3u8`)
      .outputOptions([
        "-codec: copy",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls"
      ])
      .on("end", () => resolve(`${outputFolder}/index.m3u8`))
      .on("error", reject)
      .run();
  });
};

export default convertToHLS;
