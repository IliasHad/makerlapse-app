const ffmpeg = require("@ffmpeg-installer/ffmpeg");
const util = require("electron-util");
var spawn = require("child_process").spawn;
const prettyMs = require("pretty-ms");
const moment = require("moment");
const path = require("path");
const timeRegex = /time=\s*(\d\d:\d\d:\d\d.\d\d)/gm;
const speedRegex = /speed=\s*(-?\d+(,\d+)*(\.\d+(e\d+)?)?)/gm;
const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg.path);
let progress, estimator;
const fs = require("fs");
const del = require("del");

const { sendProgressData } = require("../windows/video");

const speedUpVideo = async (inputPath, durationMs, selectedMusic) => {
  const now = Date.now();
  const outputPath = `/Users/mac/ilias/${moment(now).format(
    "YYYY-MM-DD-HH-mm-ss"
  )}.mp4`;

  console.log("Output", outputPath);
  console.log(inputPath);
  console.log(path.resolve(selectedMusic))

  let params = []

  if(selectedMusic) {
   params = [
      "-pattern_type",
      "glob",
      "-i",
      "*.png",
      "-i",
      path.resolve(selectedMusic),
      "-c:a",
      "copy",
      "-vf",
      "fps=30",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-profile:v",
      "high",
      "-vcodec",
      "libx264",
      "-crf",
      "18",
      "-coder",
      "1",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-g",
      "30",
      "-bf",
      "2",
      "-c:a",
      "aac",
      "-b:a",
      "384k",
      "-profile:a",
      "aac_low",
      "-shortest",
      outputPath
    ]
  } else {

    params = [
      "-pattern_type",
      "glob",
      "-i",
      "*.png",
   
      "-vf",
      "fps=30",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-profile:v",
      "high",
      "-vcodec",
      "libx264",
      "-crf",
      "18",
      "-coder",
      "1",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-g",
      "30",
      "-bf",
      "2",
      "-c:a",
      "aac",
      "-b:a",
      "384k",
      "-profile:a",
      "aac_low",
      outputPath]
  }
  let converter = await spawn(
    ffmpegPath,
  params,
    {
      cwd: inputPath,
    }
  );

  let speedProcessing;
  let stderr = "";

  converter.stderr.setEncoding("utf8");
  converter.stdout.setEncoding("utf8");

  converter.stdout.on("data", function(data) {
    console.log(data);
  });
  converter.stderr.on("data", function(data) {
    stderr += data;

    data = data.trim();
    const timeProccessed = timeRegex.exec(data);

    if (timeProccessed) {
      const time = moment.duration(timeProccessed[1]).asMilliseconds();
      console.log("time", parseInt(time));
      console.log("Duration Ms ", parseInt(durationMs));
      console.log("Progress");
      let progress = Math.round((time / durationMs) * 100);

      if (progress > 100) {
        progress = 100;
      }
      console.log(progress);
      sendProgressData(progress, outputPath);
    }

    converter.on("error", (err) => console.log("Error On Command", err));

    converter.on("exit", (code) => {
      if (code === 0) {
        console.log("Process Done :)");
        progressPercentage = 100;
        console.log(outputPath);

        // delete directory recursively
        const deleteFiles = async () => {
          try {
            await del(inputPath);

            console.log(`${inputPath} is deleted!`);
          } catch (err) {
            console.error(`Error while deleting ${inputPath}.`);
          }
        };
        deleteFiles();
      } else {
        console.log("Process Failed :(");
        //   speedUpVideo(inputPath)
      }
    });
  });
};

exports.speedUpVideo = speedUpVideo;

// 30 frames per second

// 200 screenshots

// Output video duration will be Number of screenshots / frame rate = Timelapse video in seconds
