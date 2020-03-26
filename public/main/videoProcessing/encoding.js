/* eslint-disable array-element-newline */
'use strict';
const path = require('path');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const util = require('electron-util');
const execa = require('execa');
var spawn = require('child_process').spawn
const prettyMs = require("pretty-ms")
const moment = require('moment')
const timeRegex = /time=\s*(\d\d:\d\d:\d\d.\d\d)/gm;
const speedRegex = /speed=\s*(-?\d+(,\d+)*(\.\d+(e\d+)?)?)/gm;
const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg.path);
const {videoWindow} = require("../windows/videos")
let progress

const getEncoding = async filePath => {
  try {
    await execa(ffmpegPath, ['-i', filePath]);
  } catch (error) {
    return /.*: Video: (.*?) \(.*/.exec(error.stderr)[1];
  }
};

// `ffmpeg -i original.mp4 -vcodec libx264 -crf 27 -preset veryfast -c:a copy output.mp4`
const speedUpVideo = async inputPath => {
  const now = Date.now()
  const outputPath = `/Users/mac/ilias/${moment(now).format('YYYY-MM-DD-HH-mm-ss')}.mp4`;




console.log("Output",outputPath)
  console.log("Hi mothers Fuckers")
 let converter = await spawn(ffmpegPath, [
    '-i', inputPath,
    '-c:v', 'libx264',
    '-an',
    '-preset', 'veryfast',
    '-profile:v', 'high',
    '-vf' ,'setpts=(1/100)*PTS',
    '-crf','18',
'-coder', '1',
'-pix_fmt','yuv420p',
'-movflags', '+faststart',
'-g', '30',
'-bf', '2',
'-c:a','aac',
'-b:a','384k',
'-profile:a','aac_low',

    outputPath
  ]);


  let speed
  let stderr = '';

  converter.stderr.setEncoding('utf8');

  converter.stderr.on('data', function (data) {
    stderr += data;

    
    data = data.trim();

      const processingSpeed = speedRegex.exec(data);


      // Duration of output video in milliseconds

      const durationMs = 6630
      if (processingSpeed) {
        speed = parseFloat(processingSpeed[1]);
        console.log("Speed :",speed)
      }


    // Processed time
      const timeProccessed = timeRegex.exec(data);


      if (timeProccessed) {
        const processedMs = moment.duration(timeProccessed[1]).asMilliseconds();
        console.log("Process MS:", processedMs, timeProccessed[1])
        progress = processedMs / durationMs;
        console.log("Process",progress)
        const progressPercentage = Math.round(progress * 100)

        // Wait 2 second in the conversion for the speed to be stable
        if (processedMs > 2 * 1000) {
          const msRemaining = (durationMs - processedMs) / speed;
          console.log("MS Remaining", msRemaining)
          console.log("After 2 Secondes Progress :", progress, "Estimator :",prettyMs(Math.max(msRemaining, 1000), {compact: true}), "Progress Percentage", progressPercentage);
          videoWindow.webContents.send('video-progress', progress);

        } else {
          console.log("Progress :", progress , "Progress Percentage", progressPercentage)

        }

        // fix issue when the progress percentage is above 100%
        if(progressPercentage > 100) {
          progressPercentage = 99
        }
      }
      converter.on('error', (err) => console.log("Error On Command", err));

      converter.on('exit', code => {
        if (code === 0) {
         
          console.log("Process Done :)")
        } else {
          console.log("Process Failed :(")

        }
      });
  
/*

    const durationMs = moment.duration(15, 'seconds').asMilliseconds();
    let speed;

   

    

      const processingSpeed = speedRegex.exec(data);

      if (processingSpeed) {
        speed = parseFloat(processingSpeed[1]);
      }

      const timeProccessed = 
      if (timeProccessed) {
        const processedMs = moment.duration(timeProccessed[1]).asMilliseconds();
        const progress = processedMs / durationMs;

        // Wait 2 second in the conversion for the speed to be stable
        if (processedMs > 2 * 1000) {
          const msRemaining = (durationMs - processedMs) / speed;
          opts.onProgress(progress, prettyMs(Math.max(msRemaining, 1000), {compact: true}).slice(1));
        } else {
          console.log(progress)
          opts.onProgress(progress);
        }
      }
    });

  */


    // The 'progress' variable contains a key value array of the data

});

};


module.exports = {
  getEncoding,
  speedUpVideo,
  progress
};