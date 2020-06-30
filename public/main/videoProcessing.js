const ffmpeg = require("@ffmpeg-installer/ffmpeg");
const util = require("electron-util");
var spawn = require("child_process").spawn;
var { exec } = require("child_process");
const { app } = require("electron");
const prettyMs = require("pretty-ms");
const moment = require("moment");
const path = require("path");
const timeRegex = /time=\s*(\d\d:\d\d:\d\d.\d\d)/gm;
const speedRegex = /speed=\s*(-?\d+(,\d+)*(\.\d+(e\d+)?)?)/gm;
const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg.path);
let progress, estimator;
const fs = require("fs");
const del = require("del");
const Store = require("electron-store");

const store = new Store();
const frameRate = store.get("frameRate") || 30;
const { sendProgressData } = require("../windows/video");
const speedUpVideo = async (inputPath, durationMs, selectedMusic) => {
  const now = Date.now();
  const outputPath = `${app.getAppPath()}/timelpase-videos/${moment(now).format(
    "YYYY-MM-DD-HH-mm-ss"
  )}.mp4`;

  fs.exists(`${app.getAppPath()}/timelpase-videos/`, (excists) => {
    if (!excists) fs.mkdirSync(`${app.getAppPath()}/timelpase-videos/`);
  });
  console.log("Output", outputPath);
  console.log(inputPath);

  let startTime = Date.now();

  let params = [];

  if (selectedMusic) {
    params = [
      "-r",
      `${frameRate}`,
      "-pattern_type",
      "glob",
      "-i",
      "*.png",
      "-stream_loop",
      "1",
      "-i",
      path.resolve(selectedMusic),
      "-c:a",
      "copy",
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
      outputPath,
    ];
  } else {
    params = [
      "-r",
      `${frameRate}`,
      "-pattern_type",
      "glob",
      "-i",
      "*.png",
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
      outputPath,
    ];
  }
  let converter = await spawn(ffmpegPath, params, {
    cwd: inputPath,
  });

  let speedProcessing;
  let stderr = "";

  converter.stderr.setEncoding("utf8");
  converter.stdout.setEncoding("utf8");

  converter.stdout.on("data", function (data) {
    console.log(data);
  });
  converter.stderr.on("data", function (data) {
    stderr += data;

    data = data.trim();
    const timeProccessed = timeRegex.exec(data);
    let isDone = false;

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
      sendProgressData(progress, outputPath, isDone);
    }

    converter.on("error", (err) => console.log("Error On Command", err));

    converter.on("exit", (code) => {
      let endTime = Date.now();
      if (code === 0) {
        console.log(
          `This video take ${(endTime - startTime) / 60000} minutes `
        );
        console.log("Process Done :)");
        progressPercentage = 100;
        console.log(outputPath);
        isDone = true;
        sendProgressData(progress, outputPath, isDone);

        // delete directory recursively
        const deleteFiles = async () => {
          try {
            let converter = await exec(`rm -r ${inputPath}`);

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
